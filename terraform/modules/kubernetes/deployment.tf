resource "kubernetes_namespace" "fairway_fish_fusion" {
  metadata {
    name = "fairway-fish-fusion"
  }
}

# Example Kubernetes Deployment for your React frontend
resource "kubernetes_deployment" "react_frontend" {
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

# Kubernetes Service to expose the React frontend
resource "kubernetes_service" "react_frontend_service" {
  metadata {
    name      = "react-frontend-service"
    namespace = kubernetes_namespace.fairway_fish_fusion.metadata[0].name
  }
  spec {
    selector = {
      app = "react-frontend"
    }
    port {
      port        = 80 # Port accessible from outside the cluster
      target_port = 80 # Port the container listens on
    }
    type = "LoadBalancer" # Use a LoadBalancer to get an external IP
  }
}