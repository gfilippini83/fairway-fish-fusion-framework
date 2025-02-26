resource "aws_ecr_repository" "blogging_site_repo" {
  name = "blogging-site-image"

  tags = {
    Name        = "blogging-site-image-repo"
    Environment = var.env
  }
}

resource "aws_ecr_lifecycle_policy" "blogging_site_lifecycle_policy" {
  repository = aws_ecr_repository.blogging_site_repo.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expire images older than 14 days",
            "selection": {
                "tagStatus": "untagged",
                "countType": "sinceImagePushed",
                "countUnit": "days",
                "countNumber": 14
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}