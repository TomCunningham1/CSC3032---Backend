import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import { logger } from '../utils/logger-utils'

const deleteFromTableQuery = 'DELETE FROM Attempt'

export const handler = async (event: any): Promise<LambdaResponseType> => {
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

  try {
    const connection = await conn.getConnection()

    const [resultScenario] = await connection.query(deleteFromTableQuery)

    logger.info('Success')

    connection.release()

    return jsonResponse(200, 'Table successfully reset')
  } catch (error) {
    logger.info('Failure')
    logger.error(error as string)
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
