output "vpc_subnets" {
  value = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

output "vpc" {
  value = aws_vpc.main.id
}