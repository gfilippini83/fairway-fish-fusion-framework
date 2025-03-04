output "lambda_invoke_arn" {
  value = aws_lambda_function.example.invoke_arn
}

output "lambda_arn" {
  value = aws_lambda_function.example.arn
}

output "lambda_execution_role_name" {
  value = aws_iam_role.lambda_role.name
}

output "lambda_execution_role_arn" {
  value = aws_iam_role.lambda_role.arn
}