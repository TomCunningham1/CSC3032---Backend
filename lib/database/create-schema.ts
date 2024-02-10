import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import environment from '../config/environment'
import { logger } from '../utils/logger-utils'

const createScenario =
  `CREATE TABLE IF NOT EXISTS Scenario (` +
  `Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,` +
  `Name VARCHAR(255)` +
  `);`

const createAttept =
  `CREATE TABLE IF NOT EXISTS Attempt (` +
  `Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,` +
  `Username VARCHAR(255),` +
  `ScenarioId INT(6) UNSIGNED,` +
  `Score Int,` +
  `NumberOfQuestions int,` +
  `NumberOfAnsweredQuestions int,` +
  `CorrectAnswers int,` +
  `WrongAnswers int,` +
  `HintsUsed int,` +
  `FiftyFiftyUsed int,` +
  `Time int,` +
  `CONSTRAINT fk_scenario FOREIGN KEY (ScenarioId) REFERENCES Scenario(Id)` +
  `);`

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

  try {
    const connection = await conn.getConnection()

    const [resultScenario] = await connection.query(createScenario)
    const [resultAttempt] = await connection.query(createAttept)

    logger.info('Success')

    connection.release()

    return jsonResponse(200, 'Schema successfully created')
  } catch (error) {
    logger.info('Failure')
    logger.error(error as string)
    return jsonResponse(500, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
