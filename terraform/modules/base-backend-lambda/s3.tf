
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
