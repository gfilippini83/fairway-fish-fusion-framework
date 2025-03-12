locals {
  domain_url  = "${var.domain_name}.com"
  record_name = "${var.env}.${local.domain_url}"
}