resource "aws_s3_bucket" "blog_bucket" {
  bucket = "blog-fff-image-hosting-bucket"

  tags = {
    Name        = "blog-fff-image-hosting-bucket"
    Environment = var.env
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.blog_bucket.id

  block_public_acls   = false
  block_public_policy = false
}

resource "aws_s3_bucket_policy" "name" {
  bucket = aws_s3_bucket.blog_bucket.id
  policy = <<EOT
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::blog-fff-image-hosting-bucket/*"
            ]
        }
    ]
}
    EOT
}

data "aws_iam_policy_document" "allow_public_access" {

}