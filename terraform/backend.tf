// ECR
resource "aws_ecr_repository" "backend" {
  name                 = local.app
  image_tag_mutability = "MUTABLE"
  force_delete         = true
  image_scanning_configuration {
    scan_on_push = true
  }
}

// VPC
resource "aws_vpc" "default" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "${local.app}_vpc"
  }
}
resource "aws_subnet" "default_1a" {
  vpc_id            = aws_vpc.default.id
  availability_zone = "ap-northeast-1a"
  cidr_block        = "10.0.0.0/24"
  tags = {
    Name = "${local.app}_1a"
  }
}
resource "aws_subnet" "default_1c" {
  vpc_id            = aws_vpc.default.id
  availability_zone = "ap-northeast-1c"
  cidr_block        = "10.0.1.0/24"
  tags = {
    Name = "${local.app}_1c"
  }
}
resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.default.id
  tags = {
    Name = "${local.app}_igw"
  }
}
resource "aws_route_table" "default" {
  vpc_id = aws_vpc.default.id
  tags = {
    Name = "${local.app}_public"
  }
}
resource "aws_route" "default" {
  destination_cidr_block = "0.0.0.0/0"
  route_table_id         = aws_route_table.default.id
  gateway_id             = aws_internet_gateway.default.id
}
resource "aws_route_table_association" "default_1a" {
  subnet_id      = aws_subnet.default_1a.id
  route_table_id = aws_route_table.default.id
}
resource "aws_route_table_association" "default_1c" {
  subnet_id      = aws_subnet.default_1c.id
  route_table_id = aws_route_table.default.id
}

// Security group
resource "aws_security_group" "api" {
  name        = "${local.app}_api_sg"
  description = "Security group for API"
  vpc_id      = aws_vpc.default.id
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "${local.app}_api_sg"
  }
}
resource "aws_security_group" "ecs" {
  name        = "${local.app}_ecs_sg"
  description = "Security group for ECS task"
  vpc_id      = aws_vpc.default.id
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "${local.app}_ecs_sg"
  }
}

// Task execution role
resource "aws_iam_role" "task_execution_role" {
  name = "${local.app}_task_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}
resource "aws_iam_role_policy_attachment" "task_execution_role" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "task_role" {
  name = "${local.app}_task_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = ["ecs-tasks.amazonaws.com"]
        }
      }
    ]
  })
}

// ECS
resource "aws_ecs_cluster" "backend" {
  name = local.app
}
resource "aws_ecs_cluster_capacity_providers" "backend" {
  cluster_name       = aws_ecs_cluster.backend.name
  capacity_providers = ["FARGATE_SPOT"]
  default_capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }
}
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/${local.app}"
  retention_in_days = 30
}
resource "aws_ecs_task_definition" "backend" {
  family                   = local.app
  requires_compatibilities = ["FARGATE"]
  cpu                      = "8192"
  memory                   = "16384"
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.task_role.arn
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = local.app
      image     = "${aws_ecr_repository.backend.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      ephemeral_storage = {
        size_in_gib = 50
      }
      logConfiguration = {
        logDriver : "awslogs",
        options : {
          awslogs-region : data.aws_region.current.name,
          awslogs-stream-prefix : "backend",
          awslogs-group : aws_cloudwatch_log_group.backend.name
        }
      }
      healthCheck = {
        command : ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
        interval : 30,
        timeout : 5,
        retries : 10,
        startPeriod : 30,
      }
    },
  ])
  depends_on = [aws_iam_role.task_role, aws_iam_role.task_execution_role]
}
resource "aws_ecs_service" "backend" {
  name            = local.app
  cluster         = aws_ecs_cluster.backend.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
  network_configuration {
    subnets          = [aws_subnet.default_1a.id, aws_subnet.default_1c.id]
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }
  service_registries {
    registry_arn = aws_service_discovery_service.backend.arn
    port         = 8080
  }
}
resource "aws_service_discovery_private_dns_namespace" "backend" {
  name = "${replace(local.app, "_", "-")}.local"
  vpc  = aws_vpc.default.id
}
resource "aws_service_discovery_service" "backend" {
  name = local.app
  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.backend.id
    dns_records {
      ttl  = 60
      type = "SRV"
    }
    routing_policy = "MULTIVALUE"
  }
  health_check_custom_config {
    failure_threshold = 10
  }
}

// API Gateway
resource "aws_apigatewayv2_api" "backend" {
  name          = local.app
  protocol_type = "HTTP"
}
resource "aws_apigatewayv2_deployment" "backend" {
  api_id = aws_apigatewayv2_api.backend.id
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [aws_apigatewayv2_route.backend]
}
resource "aws_apigatewayv2_stage" "backend" {
  api_id        = aws_apigatewayv2_api.backend.id
  name          = "$default"
  auto_deploy   = true
  deployment_id = aws_apigatewayv2_deployment.backend.id
  lifecycle {
    ignore_changes = [deployment_id, default_route_settings]
  }
}
resource "aws_apigatewayv2_route" "backend" {
  api_id    = aws_apigatewayv2_api.backend.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.backend.id}"
}
resource "aws_apigatewayv2_vpc_link" "backend" {
  name               = local.app
  security_group_ids = [aws_security_group.api.id]
  subnet_ids         = [aws_subnet.default_1a.id, aws_subnet.default_1c.id]
}
resource "aws_apigatewayv2_integration" "backend" {
  api_id             = aws_apigatewayv2_api.backend.id
  integration_type   = "HTTP_PROXY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.backend.id
  integration_method = "ANY"
  integration_uri    = aws_service_discovery_service.backend.arn
}
