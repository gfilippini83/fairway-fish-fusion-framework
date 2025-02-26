variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of IDs pertaining to our subnets"
}