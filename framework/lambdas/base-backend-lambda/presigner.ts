import { APIGatewayProxyEvent } from "aws-lambda";
import process from "process";
import { MissingEnvironmentVariableError, MissingKeyError } from "./errors";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { Axios, AxiosResponse } from "axios";


export class PresignerHandler {

    readonly bucket: string;
    readonly region: string;

    constructor() {
        this.bucket = this.getBucket()
        this.region = this.getRegion()
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
        const region = this.region
        const bucket = this.bucket
        const client = new S3Client({ region });
        const command = new PutObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(client, command, { expiresIn: 3600 });
    };

    // async put(url: string, data: string): Promise<AxiosResponse<any, any>>{
        
    //     const client = new Axios()
    //     const resp: AxiosResponse = await client.put(url, data, {headers: { "Content-Length": new Blob([data]).size}})
    //     if(resp.status <= 200 && resp.status >= 299) {
    //         console.error("There was an error with the PUT request to S3")
    //         console.error(`Status: ${resp.status}`)
    //         console.error(`StatusText: ${resp.statusText}`)
    //         console.error(`Config: ${JSON.stringify(resp.config)}`)
    //         console.error(`Headers: ${JSON.stringify(resp.headers)}`)
    //         console.error(`Data: ${JSON.stringify(resp.data)}`)
    //         throw new S3PutError()
    //     } else {
    //         console.log(`Successfully put object in S3 with response: ${JSON.stringify(resp)}`)
    //         return resp
    //     }
    //   };

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