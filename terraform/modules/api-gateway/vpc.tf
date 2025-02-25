resource "aws_vpc_endpoint" "apigateway_endpoint" {
  vpc_id            = aws_vpc.main.id                                             # Replace with your VPC ID
  service_name      = "com.amazonaws.${data.aws_region.current.name}.execute-api" # Replace YOUR_REGION
  vpc_endpoint_type = "Interface"

  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id] # Replace with your subnet IDs

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
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_api_gateway_rest_api_policy" "api_gateway_policy" {
  count       = var.enable_vpc == true ? 1 : 0
  rest_api_id = aws_api_gateway_rest_api.backend_api.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "execute-api:Invoke",
        Effect   = "Allow",
        Resource = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.id}:${aws_api_gateway_rest_api.backend_api.id}/*",
        Condition = {
          "StringEquals" : {
            "aws:SourceVpc" : aws_vpc.main.id
          }
        }
      }
    ]
  })
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16" # Example
  enable_dns_hostnames = true          # Important for Kubernetes
  tags = {
    Name = "main-vpc"
  }
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