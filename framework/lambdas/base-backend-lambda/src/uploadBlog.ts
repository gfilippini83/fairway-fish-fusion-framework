import { BlogData } from "@framework-package/commons";
import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Config } from "./environment.js";

const BLOG_PREFIX = "blogs"

export class UploadBlogHandler {

    constructor(private config: Config){}

    async s3Upload(blogData: BlogData[]) {
        try {
            const timestamp = Date.now();
            const reverseTimestamp = (Number.MAX_SAFE_INTEGER - timestamp).toString().padStart(20, '0'); // Pad with leading zeros
            const key = `${BLOG_PREFIX}/${reverseTimestamp}-blog-${timestamp}`;

            const input: PutObjectCommandInput = {
                Bucket: this.config.private_bucket,
                Key: key,
                Body: JSON.stringify(blogData)
            }
            const command = new PutObjectCommand(input)
            const response = await this.config.client.send(command)
            return response
        } catch (error) {
            throw error
        }
    }
}