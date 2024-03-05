import * as AWS from 'aws-sdk'
import { jsonResponse } from '../utils/response-utils'
import { API_VERSION, NON_PRODUCTION_ENVIRONMENT } from '../config/constants'
import { logger } from '../utils/logger-utils'

export const handler = async (event: any): Promise<any> => {
  let scenarioName = ''

  if (event?.queryStringParameters?.scenarioName) {
    scenarioName = event.queryStringParameters.scenarioName
  } else {
    return jsonResponse(400, 'Missing scenario name')
  }

  const mapQuestion = (questions: any) => {
    return questions.map((question: any) => ({
      optionC: question!.M!.optionC.S,
      optionB: question!.M!.optionB.S,
      optionA: question!.M!.optionA.S,
      optionD: question!.M!.optionD.S,
      question: question!.M!.question.S,
      stage: question!.M!.stage.S,
      explaination: question!.M!.explaination.S || 'No explaination',
      answer: question!.M!.answer.S,
    }))
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
    reconnaissance: mapQuestion(result.Item.reconnaissance.L!),
    weaponisation: mapQuestion(result.Item.weaponisation.L!),
    delivery: mapQuestion(result.Item.delivery.L!),
    exploitation: mapQuestion(result.Item.exploitation.L!),
    installation: mapQuestion(result.Item.installation.L!),
    command: mapQuestion(result.Item.command.L!),
    actions: mapQuestion(result.Item.actions.L!),
  }

  return jsonResponse(200, JSON.stringify(response))
}
