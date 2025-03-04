resource "aws_cognito_user_group" "blogger_group" {
  name         = "blogger"
  user_pool_id = aws_cognito_user_pool.user_pool.id # Replace with your user pool ID
  description  = "Users with blogger privileges"
}

# Example of how to add a user to the group (Optional)
# resource "aws_cognito_user_pool_user_group_attachment" "example" {
#   user_pool_id = aws_cognito_user_pool.user_pool.id
#   username     = "example_user" # Replace with the username of the user to add
#   group_name   = aws_cognito_user_pool_group.blogger_group.name
# }