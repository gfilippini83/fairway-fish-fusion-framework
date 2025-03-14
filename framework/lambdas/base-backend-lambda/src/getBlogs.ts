import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Config } from "./environment.js";

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
                        const content =  await data.Body?.transformToString()
                        console.log(`Content for Key: ${key}, Content: ${content}`)
                        enriched_data.push(content)
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
}
