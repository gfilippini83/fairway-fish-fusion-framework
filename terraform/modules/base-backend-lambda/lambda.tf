data "aws_region" "current" {}

resource "aws_lambda_function" "example" {
  function_name = local.function_name
  runtime       = "nodejs20.x"
  handler       = "index.handler"                                                                              # Default handler for Node.js
  filename      = "${path.module}/../../../framework/lambdas/${local.function_name}/build/lambda_function.zip" # Placeholder, CodeDeploy will handle this
  role          = aws_iam_role.lambda_role.arn
  publish       = true # Important for CodeDeploy
  vpc_config {
    subnet_ids         = var.private_vpc_subnets
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
  # Optional:  Set memory and timeout as needed
  memory_size = 128
  timeout     = 30

  environment {
    variables = {
      PRIVATE_BUCKET_NAME  = var.private_s3_bucket_name
      REGION               = data.aws_region.current.name
      CLIENT_ID            = var.cognito_client_id
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
    }
  }

  tags = {
    env = local.env
  }
  depends_on = [aws_iam_role_policy_attachment.lambda_vpc_access]
}


resource "aws_security_group" "lambda_sg" {
  name        = "lambda-security-group"
  description = "Security group for Lambda function"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow outbound HTTPS to any destination
  }

  tags = {
    Name = "lambda-sg"
    env  = var.env
  }
}

# Example CodeDeploy application
resource "aws_codedeploy_app" "lambda_app" {
  name             = "lambda-codedeploy-app"
  compute_platform = "Lambda" # Important: Specify Lambda
}

# Example CodeDeploy deployment group
resource "aws_codedeploy_deployment_group" "lambda_deployment_group" {
  app_name               = aws_codedeploy_app.lambda_app.name
  deployment_group_name  = "lambda-deployment-group"
  service_role_arn       = aws_iam_role.codedeploy_role.arn
  deployment_config_name = "CodeDeployDefault.LambdaAllAtOnce" # Or other config

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL" # For blue/green or canary deployments
    deployment_type   = "BLUE_GREEN"
  }
}
