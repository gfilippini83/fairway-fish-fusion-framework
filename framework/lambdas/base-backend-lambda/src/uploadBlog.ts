import { BlogData } from "@framework-package/commons";
import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { Config } from "./environment.js";


export class UploadBlogHandler {

    constructor(private config: Config){}

    async s3Upload(blogData: BlogData[]) {
        try {
            const client = new S3Client({
                region: this.config.aws_region
            })
            const input: PutObjectCommandInput = {
                Bucket: this.config.private_bucket,
                Key: `blogs/blog_${Date.now()}`,
                Body: JSON.stringify(blogData)
            }
            const command = new PutObjectCommand(input)
            const response = await client.send(command)
            return response
        } catch (error) {
            throw error
        }
    }
}