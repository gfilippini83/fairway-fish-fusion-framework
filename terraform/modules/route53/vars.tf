variable "alb_dns_name" {
  type        = string
  description = "Hostname for the ALB created by the kubernetes deployment"
  default     = ""
}

variable "alb_zone_id" {
  type        = string
  description = "Hostname for the ALB created by the kubernetes deployment"
  default     = ""
}