import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import environment from '../config/environment'

export const handler = async (event: any): Promise<LambdaResponseType> => {
  const user = process.env.USERNAME
  const password = process.env.PASSWORD

  const database = environment.databaseName
  const host = environment.hostName

  const dbConfig = {
    host,
    port,
    user,
    password,
    database,
  }

  const conn = createPool(dbConfig).promise()

  const query =
    `USE ${environment.databaseName};` +
    `CREATE TABLE IF NOT EXISTS Scenario (` +
    `    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,` +
    `    Name VARCHAR(255)` +
    `);` +
    `CREATE TABLE IF NOT EXISTS Attempt (` +
    `    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,` +
    `    Username VARCHAR(255),` +
    `    ScenarioId INT(6) UNSIGNED,` +
    `    Score INT,` +
    `    NumberOfQuestions INT,` +
    `    NumberOfAnsweredQuestions INT,` +
    `    CorrectAnswers INT,` +
    `    WrongAnswers INT,` +
    `    HintsUsed INT,` +
    `    FiftyFiftyUsed INT,` +
    `    Time INT,` +
    `    CONSTRAINT fk_scenario FOREIGN KEY (ScenarioId) REFERENCES Scenario(Id)` +
    `)`

  try {
    const connection = await conn.getConnection()

    const [rows] = await connection.query(query)

    connection.release()

    return jsonResponse(200, 'Schema successfully created')
  } catch (error) {
    return jsonResponse(500, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
