resource "aws_s3_bucket" "private_fff_blog_bucket" {
  bucket = local.bucket_name

  tags = {
    Name        = local.bucket_name
    Environment = var.env
  }
}

resource "aws_s3_bucket_cors_configuration" "bucket_cors" {
  bucket = aws_s3_bucket.private_fff_blog_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = [var.domain_names[0]]
  }
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = [var.domain_names[1]]
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.private_fff_blog_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.private_s3_kms.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.private_fff_blog_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

// Lambda Access

resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "lambda-s3-access-policy"
  description = "Policy to allow Lambda to read and write to S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
        ],
        Resource = [
          aws_s3_bucket.private_fff_blog_bucket.arn,
          "${aws_s3_bucket.private_fff_blog_bucket.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3_attachment" {
  role       = var.s3_access_lambda_role_name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}