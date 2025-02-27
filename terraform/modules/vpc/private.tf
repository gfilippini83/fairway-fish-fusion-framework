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

resource "aws_eip" "nat_gateway_eip" {
  domain = "vpc"
  tags = {
    Name = "nat-gateway-eip"
  }
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_gateway_eip.id
  subnet_id     = aws_subnet.eks_subnet_a.id # Replace with your public subnet ID

  tags = {
    Name = "nat-gateway"
  }

  depends_on = [aws_eip.nat_gateway_eip]
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.main.id #replace with your vpc id.

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "private-route-table"
  }
}

resource "aws_route_table_association" "private_subnet_1_route_table_association" {
  subnet_id      = aws_subnet.private_subnet_1.id #replace with your private subnet id.
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_subnet_2_route_table_association" {
  subnet_id      = aws_subnet.private_subnet_2.id #replace with your private subnet id.
  route_table_id = aws_route_table.private_route_table.id
}