### Deployment Manually
- Build the package with `npm i` and `npm run build`

- This will create a build directory with a zip in the build directory and then we must run the following command: `aws lambda update-function-code --function-name base-backend-lambda --zip-file fileb://build/lambda_function.zip`