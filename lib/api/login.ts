import { LambdaResponseType } from "../types/response-type"


export const handler = async ():Promise<LambdaResponseType>  => {
    return { 
        statusCode: 200, 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify('{"message":"test"}')
    }
}