locals {
  endpoint_configuration_type = var.env == "production" ? "PRIVATE" : "EDGE"
}