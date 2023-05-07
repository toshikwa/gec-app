APP=gec_app
ACCOUNT_ID=$(shell aws sts get-caller-identity --query "Account" --output text)
BACKEND_IMAGE=${ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/${APP}
BACKEND_IMAGE_TAG=latest

build-backend:
	docker build -t ${BACKEND_IMAGE}:${BACKEND_IMAGE_TAG} backend

push-backend:
	docker push ${BACKEND_IMAGE}:${BACKEND_IMAGE_TAG}

run-frontend:
	cd frontend && yarn dev

run-backend:
	cd backend && uvicorn run_local:app --host 0.0.0.0 --port 8080

build-frontend:
	cd frontend && yarn build

push-frontend:
	cd frontend && aws s3 sync ./out s3://gec-app-frontend/

apply:
	cd terraform && terraform apply -auto-approve
