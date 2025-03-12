resource "kubernetes_namespace" "fairway_fish_fusion" {
  metadata {
    name = "fairway-fish-fusion"
  }
}

# Example Kubernetes Deployment for your React frontend
resource "kubernetes_deployment" "react_frontend" {
  depends_on = [aws_eks_node_group.eks_nodes]
  metadata {
    name      = "react-frontend-deployment"
    namespace = kubernetes_namespace.fairway_fish_fusion.metadata[0].name
  }
  spec {
    replicas = 2 # Number of replicas
    selector {
      match_labels = {
        app = "react-frontend"
      }
    }
    template {
      metadata {
        labels = {
          app = "react-frontend"
        }
      }
      spec {
        container {
          name  = "blogging-site-image"
          image = "120306595012.dkr.ecr.us-east-1.amazonaws.com/blogging-site-image:latest" # Replace with your Docker image
          port {
            container_port = 80
          }
          resources {
            requests = {
              cpu    = "250m"
              memory = "512Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "1Gi"
            }
          }
        }
      }
    }
  }
}

# # Kubernetes Service to expose the React frontend
resource "kubernetes_service_v1" "react_frontend_service" {
  metadata {
    name      = "react-frontend-service"
    namespace = kubernetes_namespace.fairway_fish_fusion.metadata[0].name
  }
  spec {
    selector = {
      app = "react-frontend"
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "NodePort"
  }
}

resource "kubernetes_ingress_v1" "ingress" {
  wait_for_load_balancer = true
  metadata {
    name      = "${var.env}-ingress"
    namespace = kubernetes_namespace.fairway_fish_fusion.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class"                    = "alb"
      "alb.ingress.kubernetes.io/load-balancer-name"   = "fairway-fish-fusion-${var.env}"
      "alb.ingress.kubernetes.io/scheme"               = "internet-facing"
      "alb.ingress.kubernetes.io/target-type"          = "ip"
      "cert-manager.io/issuer"                         = "letsencrypt-prod" # Ensure cert-manager is installed
      "alb.ingress.kubernetes.io/listen-ports"         = "[{\"HTTP\": 80}, {\"HTTPS\":443}]"
      "alb.ingress.kubernetes.io/actions.ssl-redirect" = "{\"Type\": \"redirect\", \"RedirectConfig\": { \"Protocol\": \"HTTPS\", \"Port\": \"443\", \"StatusCode\": \"HTTP_301\"}}"
    }
  }
  spec {
    ingress_class_name = "alb"
    rule {
      host = "${var.env}.fairwayfishfusion.com"
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.react_frontend_service.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}