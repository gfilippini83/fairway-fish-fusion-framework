module "base_backend_lambda" {
  source                 = "../base-backend-lambda"
  env                    = local.env
  private_vpc_subnets    = module.vpc_configuration.private_vpc_subnets
  vpc_id                 = module.vpc_configuration.vpc_id
  private_s3_bucket_name = module.blog_s3.private_s3_bucket_name
  cognito_client_id      = module.website_cognito.user_pool_client_id
  cognito_user_pool_id   = module.website_cognito.user_pool_id
}

module "api_gateway" {
  source                         = "../api-gateway"
  env                            = local.env
  api_name                       = local.api_name
  base_backend_lambda_invoke_arn = module.base_backend_lambda.lambda_invoke_arn
  base_backend_lambda_arn        = module.base_backend_lambda.lambda_arn
  user_pool_id                   = module.website_cognito.user_pool_id
}

module "kubernetes" {
  source             = "../kubernetes"
  public_vpc_subnets = module.vpc_configuration.public_vpc_subnets
  env                = local.env
}

module "vpc_configuration" {
  source = "../vpc"
}

module "website_cognito" {
  source       = "../cognito"
  env          = local.env
  domain_names = var.domain_names
}

module "blog_s3" {
  source                     = "../s3"
  env                        = local.env
  s3_access_lambda_role_name = module.base_backend_lambda.lambda_execution_role_name
  lambda_execution_role_arn  = module.base_backend_lambda.lambda_execution_role_arn
  domain_names               = var.domain_names
}
module "route_53" {
  source       = "../route53"
  alb_dns_name = module.kubernetes.alb_dns_name
  alb_zone_id  = module.kubernetes.alb_zone_id
  env          = var.env
  domain_name  = var.framework
}