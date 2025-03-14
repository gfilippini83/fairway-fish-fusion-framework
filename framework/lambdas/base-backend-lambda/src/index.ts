import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders } from 'aws-lambda'
import { PresignerHandler } from './presigner.js';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { MissingEnvironmentVariableError, NoAuthTokenError, TokenInvalidError, UploadBlogError } from './errors.js';


const presignerHandler = new PresignerHandler()

const COGNITO_USER_POOL_ID = "COGNITO_USER_POOL_ID"
const CLIENT_ID = "CLIENT_ID"
const GROUPS = ["BLOGGER", "ADMIN"]

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<any> => {
    try {

    } catch(error) {
        if(error instanceof TokenInvalidError) {
            return wrap("Invalid Access Token.", 403)
        } else {
            return wrap("")
        }
    }
    if(event.path.includes("get_presigned_url")) {
        await validateAuth(event.headers)
        const resp: string = await presignerHandler.handle(event)
        return wrap({
            data: {
                url: resp
            }
        })
    } else if(event.path.includes("upload_blog") && event.httpMethod.toUpperCase() === "POST") {
        if(!event.body) {
            throw new UploadBlogError(`No body included in POST request.`)
        }
        await validateAuth(event.headers)
        const body = JSON.parse(event.body)
        console.log(body)
        return wrap({
            data: {
                body: event.body,
                headers: event.headers
            }
        })
    } else {
        const message = "Hello World! Update from Garrett";
        console.log(`Returning ${message}`);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify(message)
        }
    }
}

function wrap(resp: any, statusCode?: number): any {
    return {
        statusCode: (statusCode) ? statusCode : 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify(resp)
    }
}

export async function validateAuth(headers: APIGatewayProxyEventHeaders): Promise<boolean> {
    if(!headers.Authorization) {
        throw new NoAuthTokenError()
    }
    const userPoolId = getEnvVariable(COGNITO_USER_POOL_ID)
    const clientId = getEnvVariable(CLIENT_ID)
    const verifier = CognitoJwtVerifier.create({
        userPoolId: userPoolId,
        tokenUse: "id",
        clientId: clientId,
      });
      try {
        const payload: CognitoIdTokenPayload = await verifier.verify(headers.Authorization)
        console.log(`Token is valid. Payload: ${JSON.stringify(payload)}`)
        const containsProperGroup = payload['cognito:groups']?.find(group => {
            return GROUPS.includes(group.toUpperCase())
        })
        if (containsProperGroup !== undefined) {
            return true
        } else {
            throw new Error(`No proper role was found.`)
        }
      } catch (error) {
        console.log(`Token is invalid.`)
        throw new TokenInvalidError((error as Error).message)
      }
}

function getEnvVariable(envVar: string): string {
    if(!process.env[envVar]) {
        throw new MissingEnvironmentVariableError(envVar)
    }
    return process.env[envVar]
}

