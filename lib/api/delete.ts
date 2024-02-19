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

  const result = await ddb.deleteItem(params).promise()

  logger.info('Consumed DynamoDB Capacity ' + result.ConsumedCapacity)

  return jsonResponse(200, JSON.stringify(result))
}
