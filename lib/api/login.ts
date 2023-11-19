import { host, port } from '../config/constants';
import { LambdaResponseType } from '../types/response-type'
import { createConnection, createPool } from 'mysql2';
import { databaseName as database } from '../config/constants';

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

  const conn = createPool(dbConfig).promise();

  const query = `SELECT * FROM Users WHERE Username = "${requestBody.username}" AND Password = "${requestBody.password}"`;

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
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({error: error}),
    }
  } finally {
    conn.end();
  }
}
