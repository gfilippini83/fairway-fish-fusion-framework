resource "aws_route53_zone" "primary" {
  name = "fairwayfishfusion.com"

}

resource "aws_route53_record" "production_record" {
  zone_id = aws_route53_zone.primary.zone_id # Zone ID of fairwayfishfusion.com
  name    = "production.fairwayfishfusion.com"
  type    = "A"

  alias {
    # name                   = aws_lb.alb.dns_name # Will be populated by the ALB
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}