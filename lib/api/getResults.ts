import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import environment from '../config/environment'
import { logger } from '../utils/logger-utils'

interface ResultsInterface {
  username: string
  score: number
  numberOfQuestions: number
  numberOfAnsweredQuestions: number
  correctAnswers: number
  wrongAnswers: number
  hintsUsed: number
  fiftyFiftyUsed: number
  time: number
}

interface ScenarioInterface {
  Id: number
}

export const handler = async (event: any): Promise<LambdaResponseType> => {
  let scenarioName = ' '
  if (event?.queryStringParameters?.scenarioName) {
    scenarioName = event.queryStringParameters.scenarioName
  } else {
    return jsonResponse(400, 'Missing scenario name')
  }
  const user = process.env.USERNAME
  const password = process.env.PASSWORD

  const database = environment.databaseName

  const dbConfig = {
    host: environment.hostName,
    port,
    user,
    password,
    database,
  }

  const conn = createPool(dbConfig).promise()

  const query = `SELECT Id FROM Scenario WHERE Name = "${scenarioName}"`

  try {
    const connection = await conn.getConnection()

    const [data] = await connection.query(query)
    const scenarioID = data as unknown as ScenarioInterface[]
    logger.info(scenarioID[0].Id.toString())

    const query2 = `SELECT Username, Score, NumberOfQuestions, NumberOfAnsweredQuestions, CorrectAnswers, WrongAnswers, HintsUsed, FiftyFiftyUsed, Time FROM Attempt WHERE ScenarioId = ${scenarioID[0].Id} `

    const [data2] = await connection.query(query2)

    connection.release()

    return jsonResponse(
      200,
      JSON.stringify(data2 as unknown as ResultsInterface[])
    )
  } catch (error) {
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
