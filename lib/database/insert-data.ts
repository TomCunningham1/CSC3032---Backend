import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import environment from '../config/environment'

const scenario =
  `INSERT INTO Scenario (Name) VALUES ` +
  `("SQL Injection"),` +
  `("Cross Site Scripting"),` +
  `("Distributed Denial Of Service"),` +
  `("Buffer Overflow")`

const attempt =
  `INSERT INTO Attempt (Username, ScenarioId, Score, NumberOfQuestions, NumberOfAnsweredQuestions, CorrectAnswers, WrongAnswers, HintsUsed, FiftyFiftyUsed, Time) VALUES` +
  `("Tom1", 1, 32, 10, 5, 3, 2, 2, 2, 23),` +
  `("Tom2", 1, 50, 10, 10, 10, 2, 2, 2, 24),` +
  `("Tom3", 1, 13, 10, 2, 8, 3, 3, 4, 43),` +
  `("Tom4", 1, 14, 10, 8, 2, 2, 2, 2, 23),` +
  `("Tom5", 1, 14, 10, 8, 2, 2, 2, 2, 23),` +
  `("Tom6", 1, 16, 10, 8, 2, 2, 2, 2, 23),` +
  `("Tom7", 1, 30, 12, 8, 2, 2, 2, 2, 23),` +
  `("Matthew1", 2, 32, 12, 5, 3, 2, 2, 2, 23),,` +
  `("Matthew2", 2, 50, 12, 10, 10, 2, 2, 2, 24),,` +
  `("Matthew3", 2, 13, 12, 2, 8, 3, 3, 4, 43),` +
  `("Matthew4", 2, 14, 12, 8, 2, 2, 2, 2, 23),` +
  `("Matthew5", 2, 14, 12, 8, 2, 2, 2, 2, 23),` +
  `("Matthew6", 2, 16, 12, 8, 2, 2, 2, 2, 23),` +
  `("Matthew7", 2, 30, 12, 8, 2, 2, 2, 2, 23),` +
  `("James1", 3, 32, 12, 5, 3, 2, 2, 2, 23),` +
  `("James2", 3, 50, 12, 10, 10, 2, 2, 2, 24),` +
  `("James3", 3, 13, 12, 2, 8, 3, 3, 4, 43),` +
  `("James4", 3, 14, 12, 8, 2, 2, 2, 2, 23),` +
  `("James5", 3, 14, 12, 8, 2, 2, 2, 2, 23),` +
  `("James6", 3, 16, 12, 8, 2, 2, 2, 2, 23),` +
  `("James7", 3, 30, 12, 8, 2, 2, 2, 2, 23),` +
  `("Niall1", 4, 32, 12, 5, 3, 2, 2, 2, 23),` +
  `("Niall2", 4, 50, 12, 10, 10, 2, 2, 2, 24),` +
  `("Niall3", 4, 13, 12, 2, 8, 3, 3, 4, 43),` +
  `("Niall4", 4, 14, 12, 8, 2, 2, 2, 2, 23),` +
  `("Niall5", 4, 14, 12, 8, 2, 2, 2, 2, 23),` +
  `("Niall6", 4, 16, 12, 8, 2, 2, 2, 2, 23),` +
  `("Niall7", 4, 30, 12, 8, 2, 2, 2, 2, 23),`

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

    const [scenarioResponse] = await connection.query(scenario)

    const [attemptResponse] = await connection.query(attempt)

    connection.release()

    return jsonResponse(200, 'Schema successfully created')
  } catch (error) {
    return jsonResponse(500, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
