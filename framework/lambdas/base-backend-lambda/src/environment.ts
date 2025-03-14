import { S3Client } from "@aws-sdk/client-s3";
import { MissingEnvironmentVariableError } from "./errors.js";



function getBucket() {
    if (process.env.PRIVATE_BUCKET_NAME) {
        return process.env.PRIVATE_BUCKET_NAME
    } else {
        throw new MissingEnvironmentVariableError("PRIVATE_BUCKET_NAME")
    }
}

function getRegion() {
    if (process.env.AWS_REGION) {
        return process.env.AWS_REGION
    } else {
        throw new MissingEnvironmentVariableError("AWS_REGION")
    }
}

export interface Config {
    aws_region: string;
    private_bucket: string;
    client: S3Client;
}

export const s3Client = new S3Client({region: getRegion()})


export const config: Config = {
    aws_region: getRegion(),
    private_bucket:  getBucket(),
    client: s3Client
}