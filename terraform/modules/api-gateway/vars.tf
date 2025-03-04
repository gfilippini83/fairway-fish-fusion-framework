variable "api_name" {
  type        = string
  description = "String value containing the name of the API"
}

variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "base_backend_lambda_invoke_arn" {
  type        = string
  description = "Invoke ARN of the lambda that we are invoking"
}

variable "base_backend_lambda_arn" {
  type        = string
  description = "ARN of the lambda that we are invoking"
}

variable "user_pool_id" {
  type        = string
  description = "User Pool ID to authorize for the API"
}
