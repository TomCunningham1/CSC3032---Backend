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
      score: { type: aws_apigateway.JsonSchemaType.INTEGER },
      numberOfQuestions: { type: aws_apigateway.JsonSchemaType.INTEGER },
      numberOfAnsweredQuestions: {
        type: aws_apigateway.JsonSchemaType.INTEGER,
      },
      correctAnswers: { type: aws_apigateway.JsonSchemaType.INTEGER },
      wrongAnswers: { type: aws_apigateway.JsonSchemaType.INTEGER },
      hintsUsed: { type: aws_apigateway.JsonSchemaType.INTEGER },
      fiftyFiftyUsed: { type: aws_apigateway.JsonSchemaType.INTEGER },
    },
  },
}

export default EMAIL_MODEL
