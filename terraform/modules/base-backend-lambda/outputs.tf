output "lambda_invoke_arn" {
  value = aws_lambda_function.example.invoke_arn
}

output "lambda_arn" {
  value = aws_lambda_function.example.arn
}