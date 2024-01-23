import { host, port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { databaseName as database } from '../config/constants'
import { jsonResponse } from '../utils/response-utils'
import User from '../types/User'
import { logger } from '../utils/logger-utils'

interface ResultsInterface {
  username: string
  scenarioId: number
  score: number
  numberOfQuestions: number
  numberOfAnsweredQuestions: number
  correctAnswers: number
  wrongAnswers: number
  hintsUsed: number
  fiftyFiftyUsed: number
}

interface ScenarioInterface {
  Id: number
}

export const handler = async (event: any): Promise<LambdaResponseType> => {
  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  const requestBody = JSON.parse(event.body) as ResultsInterface

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

  const query2 = `SELECT Id FROM Scenario WHERE Name = "SQL Injection"`

  try {
    const connection = await conn.getConnection()

    const [data] = await connection.query(query2)
    const scenarioID = data as unknown as ScenarioInterface[]

    logger.info(scenarioID)
    logger.info(scenarioID[0].Id)

    const query =
      `INSERT INTO Attempt (Username, ScenarioId, Score, NumberOfQuestions,` +
      `NumberOfAnsweredQuestions, CorrectAnswers, WrongAnswers, HintsUsed, FiftyFiftyUsed) Values("${requestBody.username}",` +
      `${scenarioID},${requestBody.score},${requestBody.numberOfQuestions},${requestBody.numberOfAnsweredQuestions},${requestBody.correctAnswers},` +
      `${requestBody.wrongAnswers},${requestBody.hintsUsed},${requestBody.fiftyFiftyUsed})`

    await connection.query(query)

    connection.release()

    return jsonResponse(200, JSON.stringify(''))
  } catch (error) {
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
