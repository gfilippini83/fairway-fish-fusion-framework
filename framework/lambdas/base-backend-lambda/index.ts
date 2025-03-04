import { APIGatewayProxyEvent } from 'aws-lambda'
import { PresignerHandler } from './presigner';


const presignerHandler = new PresignerHandler()

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<any> => {

    if(event.path.includes("get_presigned_url")) {
        const resp: string = await presignerHandler.handle(event)
        return wrap({
            data: {
                url: resp
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

function wrap(resp: any): any {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify(resp)
    }
}
