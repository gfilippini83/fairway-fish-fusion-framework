data "aws_lb" "alb" {
  name       = kubernetes_ingress_v1.ingress.metadata[0].annotations["alb.ingress.kubernetes.io/load-balancer-name"]
  depends_on = [kubernetes_ingress_v1.ingress]
}

data "aws_eks_cluster" "cluster" {
  name = local.cluster_name
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {}

output "oidc_issuer" {
  value = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
}