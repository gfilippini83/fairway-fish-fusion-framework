resource "aws_cognito_user_pool" "user_pool" {
  name                     = "blogging-site-pool"
  auto_verified_attributes = ["email"] # Or "phone_number"
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = false
  }

  # Add other attributes as needed (e.g., name, phone number)
}

# resource "aws_cognito_user_pool_client" "user_pool_client" {
#   name                                 = "blogging-site-client"
#   user_pool_id                         = aws_cognito_user_pool.user_pool.id
#   generate_secret                      = false # For web clients, this is usually false
#   allowed_oauth_flows_user_pool_client = true
#   allowed_oauth_flows                  = ["code", "implicit"] # or "authorization_code"
#   allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
#   callback_urls                        = ["https://${var.env}.fairwayfishfusion.com/logged-in", "http://localhost:3000/logged-in", "https://production.fairwayfishfusion.com/silent_renew.html", "http://localhost:3000/silent_renew.html"] # Replace with your callback URL
#   logout_urls                          = ["https://${var.env}.fairwayfishfusion.com/logged-out", "http://localhost:3000/logged-out"]                                                                                                        # Replace with your logout URL
#   supported_identity_providers         = ["COGNITO"]                                                                                                                                                                                        # Or other providers like Google, Facebook, etc.
# }

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                                 = "blogging-site-client"
  user_pool_id                         = aws_cognito_user_pool.user_pool.id
  generate_secret                      = false # For web clients, this is usually false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"] # or "authorization_code"
  allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                        = ["${var.domain_names[0]}/logged-in", "${var.domain_names[1]}/logged-in", "${var.domain_names[0]}/silent_renew.html", "${var.domain_names[1]}/silent_renew.html"] # Replace with your callback URL
  logout_urls                          = ["${var.domain_names[0]}/logged-out", "${var.domain_names[1]}/logged-out"]                                                                                       # Replace with your logout URL
  supported_identity_providers         = ["COGNITO"]                                                                                                                                                      # Or other providers like Google, Facebook, etc.
}

resource "aws_cognito_user_pool_domain" "cognito_domain" {
  domain       = "fairway-fish-fusion-domain" # Choose a unique domain prefix
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client.id
}

output "cognito_domain" {
  value = aws_cognito_user_pool_domain.cognito_domain.domain
}

output "cognito_endpoint" {
  value = aws_cognito_user_pool_domain.cognito_domain.domain
}
