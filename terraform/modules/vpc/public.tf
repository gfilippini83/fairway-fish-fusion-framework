

# Subnets (at least two, in different AZs)
resource "aws_subnet" "eks_subnet_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24" # Adjust as needed
  availability_zone       = data.aws_availability_zones.available.names[2]
  map_public_ip_on_launch = true # If you want public IPs on your worker nodes (less common for production)

  tags = {
    Name = "eks-subnet-a"
  }
}

resource "aws_subnet" "eks_subnet_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24" # Adjust as needed
  availability_zone       = data.aws_availability_zones.available.names[3]
  map_public_ip_on_launch = true # If you want public IPs on your worker nodes (less common for production)
  tags = {
    Name = "eks-subnet-b"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "eks-igw"
  }
}

# Route Table for Public Subnets (if you want public IPs on worker nodes)
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" # Route all traffic to the internet
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "eks-public-route-table"
  }
}

resource "aws_route_table_association" "subnet_a_association" {
  subnet_id      = aws_subnet.eks_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id # Associate with public route table
}

resource "aws_route_table_association" "subnet_b_association" {
  subnet_id      = aws_subnet.eks_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id # Associate with public route table
}