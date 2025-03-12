variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "enable_vpc" {
  type        = bool
  description = "Boolean value if we should lock down the gateway to the internal VPC"
  default     = false
}

variable "domain_names" {
  type        = list(string)
  description = "List of domain names that are used for cognito and S3 rules"
}

variable "framework" {
  type        = string
  description = "String value with the name of the framework"
}