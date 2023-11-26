import { host, port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { databaseName as database } from '../config/constants'
import { jsonResponse } from '../utils/response-utils'
import User from '../types/User'

export const handler = async (event: any): Promise<LambdaResponseType> => {
  const requestBody = JSON.parse(event.body)

  if (!requestBody) {
    return jsonResponse(400, 'Missing request body')
  }

  const user = process.env.USERNAME
  const password = process.env.PASSWORD

  const dbConfig = {
    host,
    port,
    user,
    password,
    database,
  }

  const conn = createPool(dbConfig).promise()

  const query = `SELECT * FROM Users WHERE Email = "${requestBody.email}" AND Password = "${requestBody.password}"`

  try {
    const connection = await conn.getConnection()

    const [rows] = await connection.query(query)

    connection.release()

    const data = rows as unknown as User[]

    const user = {
      Username: data[0].Username,
      FirstName: data[0].FirstName,
      LastName: data[0].LastName,
      Email: data[0].Email,
    }

    return jsonResponse(200, JSON.stringify(user))
  } catch (error) {
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
