
output "alb_dns_name" {
  value = data.aws_lb.alb.dns_name
}

output "alb_zone_id" {
  value = data.aws_lb.alb.zone_id
}

output "aws_load_balancer_controller_role_arn" {
  value = aws_iam_role.aws_load_balancer_controller.arn
}
