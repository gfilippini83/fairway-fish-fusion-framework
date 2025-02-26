variable "env" {
  type        = string
  description = "String value containing the environment for off the service."
}

variable "enable_vpc" {
  type        = bool
  description = "Boolean value if we should lock down the gateway to the internal VPC"
  default     = false
}