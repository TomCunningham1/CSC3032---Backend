import * as AWS from 'aws-sdk'
import { jsonResponse } from '../utils/response-utils'
import { API_VERSION, NON_PRODUCTION_ENVIRONMENT } from '../config/constants'
import { logger } from '../utils/logger-utils'

interface Item {
  title: {
    S: string
  }
}

export const handler = async (event: any): Promise<any> => {
  const ddb = new AWS.DynamoDB(API_VERSION)

  const params = {
    TableName:
      process.env.TABLE_NAME || NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
    ProjectionExpression: 'title',
  }

  const result = await ddb.scan(params).promise()

  logger.info(JSON.stringify(result.Items))

  const scenarios: string[] = []

  result.Items?.forEach((item) => {
    const scenario = item as unknown as Item
    scenarios.push(scenario.title.S)
  })

  return jsonResponse(200, JSON.stringify(scenarios))
}
