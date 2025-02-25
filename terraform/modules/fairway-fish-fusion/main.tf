module "base_backend_lambda" {
  source = "../base-backend-lambda"
  env    = local.env
}

module "api_gateway" {
  source                         = "../api-gateway"
  env                            = local.env
  api_name                       = local.api_name
  base_backend_lambda_invoke_arn = module.base_backend_lambda.lambda_invoke_arn
}

module "kubernetes" {
  source     = "../kubernetes"
  subnet_ids = module.vpc_configuration.vpc_subnets
}

module "vpc_configuration" {
  source     = "../vpc"
  api_id     = module.api_gateway.api_id
  enable_vpc = var.enable_vpc
}