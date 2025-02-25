# Create an EKS Cluster
resource "aws_eks_cluster" "main" {
  name                          = "blogging-cluster" # Replace with your cluster name
  version                       = "1.31"             # Specify your desired Kubernetes version
  role_arn                      = aws_iam_role.cluster.arn
  bootstrap_self_managed_addons = false

  access_config {
    authentication_mode = "API"
  }

  kubernetes_network_config {
    elastic_load_balancing {
      enabled = true
    }
  }

  compute_config {
    enabled       = true
    node_pools    = ["general-purpose"]
    node_role_arn = aws_iam_role.node.arn
  }

  storage_config {
    block_storage {
      enabled = true
    }
  }

  vpc_config {
    endpoint_private_access = true
    endpoint_public_access  = true
    subnet_ids              = var.subnet_ids # Replace with your subnet IDs
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.cluster_AmazonEKSComputePolicy,
    aws_iam_role_policy_attachment.cluster_AmazonEKSBlockStoragePolicy,
    aws_iam_role_policy_attachment.cluster_AmazonEKSLoadBalancingPolicy,
    aws_iam_role_policy_attachment.cluster_AmazonEKSNetworkingPolicy,
  ]
}

# Create worker node group
resource "aws_eks_node_group" "worker_node_group" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "worker-node-group"
  version         = aws_eks_cluster.main.version
  instance_types  = ["t3.micro"]

  subnet_ids = var.subnet_ids

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }

  # IAM Role for the worker nodes
  node_role_arn = aws_iam_role.node.arn

  # Update policy for worker nodes to allow access to ECR if you are using private container registry
  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy
  ]
}