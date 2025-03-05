
resource "aws_kms_key" "private_s3_kms" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 10
  policy = jsonencode({
    Version = "2012-10-17",
    Id      = "key-default-1",
    Statement = [
      {
        Sid    = "Enable IAM User Permissions",
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        },
        Action   = "kms:*",
        Resource = "*"
      },
      {
        Sid    = "Allow Lambda Role to Generate Data Keys",
        Effect = "Allow",
        Principal = {
          AWS = var.lambda_execution_role_arn
        },
        Action   = "kms:GenerateDataKey",
        Resource = "*"
      }
    ]
  })
}

data "aws_caller_identity" "current" {}