import { APIGatewayProxyEvent } from "aws-lambda";
import { MissingKeyError } from "./errors.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Config } from "./environment.js";


export class PresignerHandler {
    constructor(private config: Config) {

    }
    async handle( event: APIGatewayProxyEvent ): Promise<string> {
        if(!event.queryStringParameters?.key) {
            throw new MissingKeyError()
        }
        const key: string = event.queryStringParameters.key
        return await this.createPresignedUrlWithClient(key)
        // return await this.put(url, event.body!)
        

    }

    async createPresignedUrlWithClient(key: string) {
        const region = this.config.aws_region
        const bucket = this.config.private_bucket
        const client = new S3Client({ region });
        const command = new PutObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(client, command, { expiresIn: 3600 });
    };
}