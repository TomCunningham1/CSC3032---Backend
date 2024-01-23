import { aws_apigateway } from 'aws-cdk-lib'
import { ModelOptions } from 'aws-cdk-lib/aws-apigateway'

const SAVE_RESULTS_MODEL: ModelOptions = {
  contentType: 'application/json',
  modelName: 'SaveResultsModel',
  schema: {
    schema: aws_apigateway.JsonSchemaVersion.DRAFT4,
    title: 'SaveResultsSchema',
    type: aws_apigateway.JsonSchemaType.OBJECT,
    properties: {
      username: { type: aws_apigateway.JsonSchemaType.STRING },
      scenarioName: { type: aws_apigateway.JsonSchemaType.STRING },
      score: { type: aws_apigateway.JsonSchemaType.NUMBER },
      numberOfQuestions: { type: aws_apigateway.JsonSchemaType.NUMBER },
      numberOfAnsweredQuestions: {
        type: aws_apigateway.JsonSchemaType.NUMBER,
      },
      correctAnswers: { type: aws_apigateway.JsonSchemaType.NUMBER },
      wrongAnswers: { type: aws_apigateway.JsonSchemaType.NUMBER },
      hintsUsed: { type: aws_apigateway.JsonSchemaType.NUMBER },
      fiftyFiftyUsed: { type: aws_apigateway.JsonSchemaType.NUMBER },
    },
  },
}

export default SAVE_RESULTS_MODEL
