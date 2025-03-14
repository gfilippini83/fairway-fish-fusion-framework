import { APIGatewayProxyEvent } from "aws-lambda";
import process from "process";
import { MissingEnvironmentVariableError, MissingKeyError } from "./errors.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


export class PresignerHandler {

    async handle( event: APIGatewayProxyEvent ): Promise<string> {
        if(!event.queryStringParameters?.key) {
            throw new MissingKeyError()
        }
        const key: string = event.queryStringParameters.key
        return await this.createPresignedUrlWithClient(key)
        // return await this.put(url, event.body!)
        

    }

    async createPresignedUrlWithClient(key: string) {
        const region = this.getRegion()
        const bucket = this.getBucket()
        const client = new S3Client({ region });
        const command = new PutObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(client, command, { expiresIn: 3600 });
    };

    getBucket() {
        if (process.env.PRIVATE_BUCKET_NAME) {
            return process.env.PRIVATE_BUCKET_NAME
        } else {
            throw new MissingEnvironmentVariableError("PRIVATE_BUCKET_NAME")
        }
    }
    
    getRegion() {
        if (process.env.AWS_REGION) {
            return process.env.AWS_REGION
        } else {
            throw new MissingEnvironmentVariableError("AWS_REGION")
        }
    }
}