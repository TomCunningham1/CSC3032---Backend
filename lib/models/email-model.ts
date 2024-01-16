import { aws_apigateway } from 'aws-cdk-lib'
import { ModelOptions } from 'aws-cdk-lib/aws-apigateway'

const EMAIL_MODEL: ModelOptions = {
  contentType: 'application/json',
  modelName: 'EmailModel',
  schema: {
    schema: aws_apigateway.JsonSchemaVersion.DRAFT4,
    title: 'EmailSchema',
    type: aws_apigateway.JsonSchemaType.OBJECT,
    properties: {
      target: { type: aws_apigateway.JsonSchemaType.STRING },
      score: { type: aws_apigateway.JsonSchemaType.STRING },
      numberOfQuestions: { type: aws_apigateway.JsonSchemaType.STRING },
      numberOfAnsweredQuestions: {
        type: aws_apigateway.JsonSchemaType.STRING,
      },
      correctAnswers: { type: aws_apigateway.JsonSchemaType.STRING },
      wrongAnswers: { type: aws_apigateway.JsonSchemaType.STRING },
      hintsUsed: { type: aws_apigateway.JsonSchemaType.STRING },
      fiftyFiftyUsed: { type: aws_apigateway.JsonSchemaType.STRING },
    },
  },
}

export default EMAIL_MODEL
