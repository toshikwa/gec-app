// S3
resource "aws_s3_bucket" "frontend" {
  bucket        = replace("${local.app}_frontend", "_", "-")
  force_destroy = true
}
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend.json
}

// IAM
data "aws_iam_policy_document" "frontend" {
  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.frontend.iam_arn]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
  }
}
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.frontend.id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }
  enabled             = true
  default_root_object = "index.html"
  default_cache_behavior {
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = aws_s3_bucket.frontend.id
    viewer_protocol_policy   = "redirect-to-https"
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
resource "aws_cloudfront_origin_access_identity" "frontend" {}
