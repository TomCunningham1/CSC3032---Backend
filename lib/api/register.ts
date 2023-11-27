import { host, port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { databaseName as database } from '../config/constants'
import { jsonResponse } from '../utils/response-utils'

/**
 *
 * @param event {
 *   "username": "",
 *   "password": "",
 *   "email": "",
 *   "firstName": "",
 *   "lastName": ""
 * }
 * @returns
 */
export const handler = async (event: any): Promise<LambdaResponseType> => {

  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  const requestBody = JSON.parse(event.body)


  const user = process.env.USERNAME
  const password = process.env.PASSWORD

  const dbConfig = {
    host,
    port,
    user,
    password,
    database,
  }

  const username = requestBody.username
  const firstName = requestBody.firstName
  const lastName = requestBody.lastName
  const email = requestBody.email
  const userPassword = requestBody.password

  if (!username || !firstName || !lastName || !email || !userPassword) {
    return jsonResponse(400, 'Missing request data')
  }

  const conn = createPool(dbConfig).promise()

  const query = `INSERT INTO \`Users\` ( \`Username\`, \`FirstName\`, \`LastName\`, \`Email\`, \`RegDate\`, \`Password\` ) VALUES 
  ('${username}', '${firstName}', '${lastName}', '${email}', CURDATE(), '${userPassword}'); `

  try {
    const connection = await conn.getConnection()

    const [rows] = await connection.query(query)

    connection.release()

    return jsonResponse(200, JSON.stringify(rows))
  } catch (error) {
    return jsonResponse(500, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
