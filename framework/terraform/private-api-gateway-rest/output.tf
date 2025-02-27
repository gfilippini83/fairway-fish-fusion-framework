output "rest_api_id" {
  value = aws_api_gateway_rest_api.backend_api.id
}

output "rest_api_execution_arn" {
  value = aws_api_gateway_rest_api.backend_api.execution_arn
}