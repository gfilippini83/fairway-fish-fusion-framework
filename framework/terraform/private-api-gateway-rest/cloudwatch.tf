resource "aws_iam_role" "apigateway_logs_role" {
  name = "apigateway_logs_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_policy" "apigateway_logs_policy" {
  name = "apigateway_logs_policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents",
        ],
        Effect   = "Allow",
        Resource = "*", # Or make more specific if needed
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apigateway_logs_policy_attachment" {
  role       = aws_iam_role.apigateway_logs_role.name
  policy_arn = aws_iam_policy.apigateway_logs_policy.arn
}

resource "aws_api_gateway_account" "cloudwatch_account" {
  cloudwatch_role_arn = aws_iam_role.apigateway_logs_role.arn # Set the role ARN here
}