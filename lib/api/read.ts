import * as AWS from 'aws-sdk'
import { jsonResponse } from '../utils/response-utils'
import { API_VERSION, NON_PRODUCTION_ENVIRONMENT } from '../config/constants'
import { logger } from '../utils/logger-utils'

export const handler = async (event: any): Promise<any> => {
  let scenarioName = ''

  if (event?.queryStringParameters?.scenarioName) {
    scenarioName = event.queryStringParameters.scenarioName
  } else {
    return jsonResponse(400, 'Missing student number')
  }

  const ddb = new AWS.DynamoDB(API_VERSION)

  const params = {
    TableName:
      process.env.TABLE_NAME || NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
    Key: {
      title: { S: scenarioName },
    },
  }

  const result = await ddb.getItem(params).promise()

  logger.info('Consumed DynamoDB Capacity ' + result.ConsumedCapacity)

  if (!result.Item) {
    return jsonResponse(404, 'Scenario Not Found')
  }

  const response = {
    title: result.Item.title.S,
    questions: result.Item.questions.L!.map((question) => ({
      optionC: question!.M!.optionC.S,
      optionB: question!.M!.optionB.S,
      optionA: question!.M!.optionA.S,
      optionD: question!.M!.optionD.S,
      question: question!.M!.question.S,
      answer: question!.M!.answer.S,
    })),
  }

  return jsonResponse(200, JSON.stringify(response))
}
