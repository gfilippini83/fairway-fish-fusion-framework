

# EKS Cluster
resource "aws_eks_cluster" "eks_cluster" {
  name     = "my-eks-cluster"
  version  = "1.31"                            # Or your preferred Kubernetes version
  role_arn = aws_iam_role.eks_cluster_role.arn # IAM role for the cluster

  vpc_config {
    # subnet_ids = [aws_subnet.eks_subnet_a.id, aws_subnet.eks_subnet_b.id]
    subnet_ids = var.public_vpc_subnets
  }

  # Ensure the cluster control plane endpoints are private if you are not using public IPs on worker nodes
  # private_access = true # Uncomment if you want private access

  tags = {
    Name = "eks-cluster"
  }
}

# EKS Node Group (Worker Nodes)
resource "aws_eks_node_group" "eks_nodes" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = "my-eks-node-group"
  subnet_ids      = var.public_vpc_subnets
  instance_types  = ["t3.medium"]                       # Or your preferred instance types
  version         = aws_eks_cluster.eks_cluster.version # Important: Match the cluster version

  scaling_config {
    desired_size = 3
    max_size     = 6
    min_size     = 1
  }
  # IAM Role for the worker nodes
  node_role_arn = aws_iam_role.eks_node_role.arn

  tags = {
    Name = "eks-node-group"
  }
}

# Kubernetes Provider Configuration (After cluster creation)
provider "kubernetes" {
  host                   = aws_eks_cluster.eks_cluster.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.eks_cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.auth.token
}

data "aws_eks_cluster_auth" "auth" {
  name = aws_eks_cluster.eks_cluster.name
}