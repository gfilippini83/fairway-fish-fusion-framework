variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "public_vpc_subnets" {
  type        = list(string)
  description = "List of IDs pertaining to our subnets"
}