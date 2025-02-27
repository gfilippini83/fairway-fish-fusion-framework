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
  description = "ARN of the lambd that we are invoking"
}

variable "vpc_endpoint_id" {
  type = string
  description = "vpc endpoint ID"
  
}