resource "aws_lambda_function" "example" {
  function_name = "base-backend-lambda"
  runtime       = "nodejs20.x"
  handler       = "index.handler"                                                                     # Default handler for Node.js
  filename      = "${path.module}/../../../framework/lambdas/base-backend-lambda/lambda_function.zip" # Placeholder, CodeDeploy will handle this
  role          = aws_iam_role.lambda_role.arn
  publish       = true # Important for CodeDeploy

  # Optional:  Set memory and timeout as needed
  memory_size = 128
  timeout     = 30

  tags = {
    "env" = local.env
  }
  # No code is included here. CodeDeploy will handle deployments.
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name = "lambda_policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*", # Or make more specific
      },
      # Add other permissions as needed by your Lambda function
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
        ],
        Effect   = "Allow",
        Resource = "*", # Be as specific as possible in production
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}


# Create an S3 bucket for your Lambda function code deployments.
resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = "lambda-deployments-${random_string.suffix.result}" # Unique bucket name
  force_destroy = true                                                # Allow bucket deletion even with contents for demo purposes. Remove in production

  tags = {
    "env" = local.env
  }
}

resource "aws_s3_bucket_ownership_controls" "ownership" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.ownership]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "lambda_bucket_versioning" {
  bucket = aws_s3_bucket.lambda_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
  lower   = false
  numeric = true
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

  #   auto_rollback_configuration {
  #     enabled = true
  #     events  = ["DEPLOYMENT_FAILURE"]
  #   }

  # Deployment configuration
  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL" # For blue/green or canary deployments
    deployment_type   = "BLUE_GREEN"
  }
}

# IAM role for CodeDeploy
resource "aws_iam_role" "codedeploy_role" {
  name = "codedeploy_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codedeploy.amazonaws.com"
        }
      },
    ]
  })
}

# Policy to allow CodeDeploy to deploy to Lambda
resource "aws_iam_policy" "codedeploy_policy" {
  name = "codedeploy_policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "lambda:*"
        ],
        Effect   = "Allow",
        Resource = aws_lambda_function.example.arn,
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
        ],
        Effect   = "Allow",
        Resource = aws_s3_bucket.lambda_bucket.arn, # Limit to the deployment bucket
      },
      {
        Action = [
          "iam:PassRole"
        ],
        Effect   = "Allow",
        Resource = aws_iam_role.lambda_role.arn,
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "codedeploy_policy_attachment" {
  role       = aws_iam_role.codedeploy_role.name
  policy_arn = aws_iam_policy.codedeploy_policy.arn
}
