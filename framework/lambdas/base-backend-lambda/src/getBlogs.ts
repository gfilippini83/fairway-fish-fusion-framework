import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Config } from "./environment.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BLOG_PREFIX = "blogs"

export class GetBlogsHandler {
    constructor(private config: Config) {}

    async getPaginatedObjects(
        limit = 20,
        continuationToken: undefined | string = undefined
    ) {
        try {
            const input: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: this.config.private_bucket,
                Prefix: `${BLOG_PREFIX}/`,
                MaxKeys: limit,
                ContinuationToken: continuationToken,
            });
        
            const response = await this.config.client.send(input);
            
            console.log(`List of objects in S3 at prefix:${BLOG_PREFIX}: ${JSON.stringify(response.Contents)}`)
            let enriched_data = []
            if (response.Contents) {
                for (const object of response.Contents) {
                    const key = object.Key
                    if(key) {
                        const getInput = new GetObjectCommand({
                            Bucket: this.config.private_bucket,
                            Key: key
                        })
                        const data = await this.config.client.send(getInput)
                        let content =  await data.Body?.transformToString()
                        console.log(`Content for Key: ${key}, Content: ${content}`)
                        if(content !== undefined) {
                            let parsedContent = JSON.parse(content)
                            for( let section of parsedContent) {
                                if(section.contentType === "Image/Video" || section.contentType === "Image") {
                                    const url = await this.getKeyPresignedUrl(section.key);
                                    section.key = url
                                }
                            }
                            enriched_data.push(JSON.stringify(parsedContent))
                        }
                    }
                }
            }
            console.log(`Enriched data from S3: ${JSON.stringify(enriched_data)}`)
            return {
                objects: enriched_data || [],
                nextContinuationToken: response.NextContinuationToken,
            };
        } catch (error) {
            console.error("Error listing objects:", error);
            throw error;
        }
    }
    async getKeyPresignedUrl(key: any) {
        try {
            const command = new GetObjectCommand({
              Bucket: this.config.private_bucket,
              Key: key,
            });
        
            let preSignedUrl: string = await getSignedUrl(this.config.client, command, { expiresIn: 60 * 10 });
            return preSignedUrl;
        
          } catch (error) {
            console.error("Error generating pre-signed URL:", error);
            return null; // Or handle the error appropriately
          }
    }
}
