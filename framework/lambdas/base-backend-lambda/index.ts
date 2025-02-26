import { APIGatewayProxyEvent } from 'aws-lambda'

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<any> => {
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