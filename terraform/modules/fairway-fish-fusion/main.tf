module "base_backend_lambda" {
  source              = "../base-backend-lambda"
  env                 = local.env
  private_vpc_subnets = module.vpc_configuration.private_vpc_subnets
  vpc_id              = module.vpc_configuration.vpc_id
}

module "api_gateway" {
  source                         = "../api-gateway"
  env                            = local.env
  api_name                       = local.api_name
  base_backend_lambda_invoke_arn = module.base_backend_lambda.lambda_invoke_arn
  base_backend_lambda_arn        = module.base_backend_lambda.lambda_arn
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
  source = "../cognito"
  env = local.env
}