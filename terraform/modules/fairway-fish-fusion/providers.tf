terraform {
  backend "s3" {
    bucket = "terraform-state-bucket-fairway-fish-project" # Replace with your bucket name
    key    = "fairway_fish_project/terraform.tfstate"      # Path within the bucket
    region = "us-east-1"                                   # Replace with your AWS region (e.g., "us-east-1")

    # Optional: If your bucket is versioned, you can specify the version ID
    # versioning = true
    # dynamodb_table = "your-dynamodb-table" # Optional: for state locking
    # encrypt = true # Optional: for server-side encryption
  }
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  # Configuration options
  region = "us-east-1"
}