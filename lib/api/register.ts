import { host, port } from '../config/constants';
import { LambdaResponseType } from '../types/response-type'
import { createConnection, createPool } from 'mysql2';
import { databaseName as database } from '../config/constants';

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

  const requestBody = JSON.parse(event.body)

  if (!requestBody) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({error: 'Missing request body'}),
    }
  }

  const user = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const dbConfig = {
    host,
    port,
    user,
    password,
    database
  }

  const username = requestBody.username;
  const firstName = requestBody.firstName;
  const lastName = requestBody.lastName;
  const email = requestBody.email;
  const userPassword = requestBody.password;

  if (!username || !firstName || !lastName || !email || !userPassword) {
    return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({error: 'Missing data'}),
      }
  }

  const conn = createPool(dbConfig).promise();

  const query = `INSERT INTO \`Users\` ( \`Username\`, \`FirstName\`, \`LastName\`, \`Email\`, \`RegDate\`, \`Password\` ) VALUES 
  ('${username}', '${firstName}', '${lastName}', '${email}', CURDATE(), '${userPassword}'); `

  try {
    const connection = await conn.getConnection();

    const [rows] = await connection.query(query);

    connection.release();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({body: rows}),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({error: error}),
    }
  } finally {
    conn.end();
  }
}