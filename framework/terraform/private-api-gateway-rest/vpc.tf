resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16" # Example
  enable_dns_hostnames = true          # Important for Kubernetes
  enable_dns_support   = true
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_vpc_endpoint" "apigateway_endpoint" {
  vpc_id            = aws_vpc.main.id                                             # Replace with your VPC ID
  service_name      = "com.amazonaws.${data.aws_region.current.name}.execute-api" # Replace YOUR_REGION
  vpc_endpoint_type = "Interface"

  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id] # Replace with your subnet IDs
  # subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
  security_group_ids = [aws_security_group.apigateway_endpoint_sg.id] # Security group for the endpoint
  private_dns_enabled = true
}

resource "aws_security_group" "apigateway_endpoint_sg" {
  vpc_id = aws_vpc.main.id
  # Add rules to allow traffic from resources in your VPC that need to access the API
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Example CIDR block for your VPC
  }
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

data "aws_iam_policy_document" "allow_private_gateway_policy" {
  statement {
    sid    = "AllowPolicy"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions   = ["execute-api:Invoke"]
    resources = ["${aws_api_gateway_rest_api.backend_api.execution_arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "aws:sourceVpce"
      values   = [aws_vpc_endpoint.apigateway_endpoint.id]
    }
  }
}

resource "aws_api_gateway_rest_api_policy" "attach_gateway_policies" {
  rest_api_id = aws_api_gateway_rest_api.backend_api.id
  policy      = data.aws_iam_policy_document.allow_private_gateway_policy.json
}

# Private Subnets (for your Kubernetes worker nodes and API Gateway VPC Endpoint)
resource "aws_subnet" "private_subnet_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.11.0/24" # Different CIDR block
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false # No public IPs for private subnets
  tags = {
    Name = "private-subnet-1"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.12.0/24" # Different CIDR block, different AZ
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false
  tags = {
    Name = "private-subnet-2"
  }
}