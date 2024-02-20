import * as AWS from 'aws-sdk'
import { jsonResponse } from '../utils/response-utils'
import { API_VERSION, NON_PRODUCTION_ENVIRONMENT, port } from '../config/constants'
import { logger } from '../utils/logger-utils'
import { createPool } from 'mysql2'

// Delete Lambda
export const handler = async (event: any): Promise<any> => {
  let scenarioName = ''

  // Check scenario name is included return 400 if not
  if (event?.queryStringParameters?.scenarioName) {
    scenarioName = event.queryStringParameters.scenarioName
  } else {
    return jsonResponse(400, 'Missing scenario name')
  }

  // Connect to dynamodb table
  const ddb = new AWS.DynamoDB(API_VERSION)

  const params = {
    TableName:
      process.env.TABLE_NAME || NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
    Key: {
      title: { S: scenarioName },
    },
  }

  // Return and log result from dynamodb
  const result = await ddb.deleteItem(params).promise()

  logger.info('Consumed DynamoDB Capacity ' + result.ConsumedCapacity)

  // Remove from database

  const user = process.env.USERNAME
  const password = process.env.PASSWORD
  const database = process.env.DATABASE
  const host = process.env.HOST

  const dbConfig = {
    host,
    port,
    user,
    password,
    database,
  }

  const conn = createPool(dbConfig).promise()

  const removeAttemptQuery = `DELETE FROM Attempt WHERE ScenarioID IN (SELECT Id From Scenario WHERE Name = "${scenarioName}");`
  const removeScenarioQuery = `DELETE FROM Scenario WHERE Name = "${scenarioName}"`

  try {
    const connection = await conn.getConnection()

    await connection.query(removeAttemptQuery)

    await connection.query(removeScenarioQuery)

    connection.release()

    return jsonResponse(200, JSON.stringify(result))
  } catch (error) {
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
