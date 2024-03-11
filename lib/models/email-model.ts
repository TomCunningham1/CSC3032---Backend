import { aws_apigateway, aws_apigatewayv2 } from 'aws-cdk-lib'
import { ModelOptions } from 'aws-cdk-lib/aws-apigateway'

const EMAIL_MODEL: ModelOptions = {
  contentType: 'application/json',
  modelName: 'EmailModel',
  schema: {
    schema: aws_apigateway.JsonSchemaVersion.DRAFT4,
    title: 'EmailSchema',
    type: aws_apigateway.JsonSchemaType.OBJECT,
    required: [
      'target',
      'score',
      'numberOfQuestions',
      'numberOfAnsweredQuestions',
      'correctAnswers',
      'wrongAnswers',
      'hintsUsed',
      'fiftyFiftyUsed',
      'time',
    ],
    properties: {
      target: { type: aws_apigateway.JsonSchemaType.STRING },
      score: { type: aws_apigateway.JsonSchemaType.NUMBER },
      numberOfQuestions: { type: aws_apigateway.JsonSchemaType.NUMBER },
      numberOfAnsweredQuestions: {
        type: aws_apigateway.JsonSchemaType.NUMBER,
      },
      correctAnswers: { type: aws_apigateway.JsonSchemaType.NUMBER },
      wrongAnswers: { type: aws_apigateway.JsonSchemaType.NUMBER },
      hintsUsed: { type: aws_apigateway.JsonSchemaType.NUMBER },
      fiftyFiftyUsed: { type: aws_apigateway.JsonSchemaType.NUMBER },
      time: { type: aws_apigateway.JsonSchemaType.NUMBER },
    },
  },
}

export default EMAIL_MODEL
