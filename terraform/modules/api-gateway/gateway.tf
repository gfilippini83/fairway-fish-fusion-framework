resource "aws_api_gateway_rest_api" "backend_api" {
  name        = var.api_name
  description = "Public API Gateway for Lambda function"
  endpoint_configuration {
    types = ["EDGE"]
  }

  body = templatefile("${path.module}/../../../specifications/${var.env}/api_spec.yaml", {
    api_name            = var.api_name,
    lambda_invoke_arn   = var.base_backend_lambda_invoke_arn,
    apigateway_role_arn = aws_iam_role.apigateway_role.arn
  })
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.backend_api.id
  triggers = {
    redeployment = sha1(templatefile("${path.module}/../../../specifications/${var.env}/api_spec.yaml", {
      api_name            = var.api_name,
      lambda_invoke_arn   = var.base_backend_lambda_invoke_arn,
      apigateway_role_arn = aws_iam_role.apigateway_role.arn
    }))
  }
  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway Stage
resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.backend_api.id
  stage_name    = var.env
  depends_on    = [aws_api_gateway_account.cloudwatch_account]
}



# IAM Role for API Gateway (if not already defined)
resource "aws_iam_role" "apigateway_role" {
  name = "apigateway_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      },
    ]
  })
}

# Policy to allow API Gateway to invoke Lambda (if not already defined)
resource "aws_iam_policy" "apigateway_policy" {
  name = "apigateway_policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "lambda:InvokeFunction",
        Effect   = "Allow",
        Resource = var.base_backend_lambda_arn, # ARN of your Lambda function
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apigateway_policy_attachment" {
  role       = aws_iam_role.apigateway_role.name
  policy_arn = aws_iam_policy.apigateway_policy.arn
}