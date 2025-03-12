variable "env" {
  type        = string
  description = "String value with the environment"
}

variable "domain_names" {
  type        = list(string)
  description = "list of domain names for callback and redirects"
}