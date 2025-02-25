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