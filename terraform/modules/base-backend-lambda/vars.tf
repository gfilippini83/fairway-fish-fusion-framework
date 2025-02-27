variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "private_vpc_subnets" {
  type        = list(string)
  description = "List of IDs pertaining to our private subnets"
}

variable "vpc_id" {
  type        = string
  description = "Main VPC ID"
}