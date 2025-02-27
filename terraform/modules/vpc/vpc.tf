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
