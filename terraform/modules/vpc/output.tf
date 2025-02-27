output "private_vpc_subnets" {
  value = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

output "public_vpc_subnets" {
  value = [aws_subnet.eks_subnet_a.id, aws_subnet.eks_subnet_b.id]
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "vpc_endpoint_id" {
  value = aws_vpc_endpoint.apigateway_endpoint.id
}