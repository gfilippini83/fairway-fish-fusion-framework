variable "env" {
  type        = string
  description = "String value with the environment"
}

variable "s3_access_lambda_role_name" {
  type        = string
  description = "String value with the lambda execution role name"
}

variable "lambda_execution_role_arn" {
  type        = string
  description = "Lambda execution role arn"
}