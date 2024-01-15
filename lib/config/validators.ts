import { RequestValidatorOptions } from "aws-cdk-lib/aws-apigateway";

const emailRequestValidator: RequestValidatorOptions = {
    requestValidatorName: 'EmailRequestValidator',
    validateRequestBody: true,
    validateRequestParameters: false
}

export {
    emailRequestValidator
}