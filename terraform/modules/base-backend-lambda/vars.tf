variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "cognito_client_id" {
  type        = string
  description = "String value with the client ID for the cognito pool"

}

variable "cognito_user_pool_id" {
  type        = string
  description = "String value with the cognito user pool ID for the cognito pool"

}

variable "private_vpc_subnets" {
  type        = list(string)
  description = "List of IDs pertaining to our private subnets"
}

variable "vpc_id" {
  type        = string
  description = "Main VPC ID"
}

variable "private_s3_bucket_name" {
  type        = string
  description = "Name of the private s3 bucket"
}