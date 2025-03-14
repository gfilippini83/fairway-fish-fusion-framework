import chaiAsPromised from 'chai-as-promised';
import { validateAuth } from '../../src/index.js';
import { CognitoJwtVerifier  } from "aws-jwt-verify";
import { APIGatewayProxyEventHeaders } from "aws-lambda";
import * as sinon from "sinon";
import * as chai from 'chai';
import { TokenInvalidError } from '../../src/errors.js';

chai.use(chaiAsPromised)
const expect = chai.expect

describe("Authorizer test", () => {
  let createStub: any
  beforeEach(() => {
      process.env.PRIVATE_BUCKET_NAME = "test_private_bucket"
      process.env.AWS_REGION = "local-1"
      process.env.COGNITO_USER_POOL_ID = "test_pool_id"
      process.env.CLIENT_ID = "test_client_id"
      createStub = sinon.stub(CognitoJwtVerifier, 'create') as unknown as sinon.SinonStub<any[], CognitoJwtVerifier<any, any, false>>;
  });

  afterEach(() => {
      createStub.restore();
  })

  it("Proper role was found in token", async () => {
      const testHeaders: APIGatewayProxyEventHeaders = {
          Authorization: "test_auth"
      }

      const mockVerifier = {
          verify: sinon.stub().resolves({ sub: 'user-id', 'cognito:groups': ["admin"], }), // Example mock verify function
      };
      createStub.returns(mockVerifier as unknown as CognitoJwtVerifier<any, any, false>)

      const resp = await validateAuth(testHeaders)
      expect(resp === true)
  });

  it("Proper role was not found in token", async () => {
      const testHeaders: APIGatewayProxyEventHeaders = {
          Authorization: "test_auth"
      }

      const mockVerifier = {
          verify: sinon.stub().resolves({ sub: 'user-id', 'cognito:groups': ["user"], }), // Example mock verify function
      };
      createStub.returns(mockVerifier as unknown as CognitoJwtVerifier<any, any, false>)


      await expect(validateAuth(testHeaders)).to.be.rejectedWith(TokenInvalidError, "Token was provided but it was invalid: No proper role was found.");
  });
});