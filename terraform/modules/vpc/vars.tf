variable "enable_vpc" {
  type        = bool
  description = "Boolean value if we should lock down the gateway to the internal VPC"
  default     = false
}

variable "api_id" {
  type        = string
  description = "ID For the API that we are attaching to the VPC"
}