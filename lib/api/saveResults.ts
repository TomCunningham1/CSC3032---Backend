import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import environment from '../config/environment'

interface ResultsInterface {
  username: string
  scenarioName: string
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
  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  const requestBody = JSON.parse(event.body) as ResultsInterface

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

  const query2 = `SELECT Id FROM Scenario WHERE Name = "${requestBody.scenarioName}"`

  try {
    const connection = await conn.getConnection()

    const [data] = await connection.query(query2)
    const scenarioID = data as unknown as ScenarioInterface[]

    const query =
      `INSERT INTO Attempt (Username, ScenarioId, Score, NumberOfQuestions,` +
      `NumberOfAnsweredQuestions, CorrectAnswers, WrongAnswers, HintsUsed, FiftyFiftyUsed, Time) Values("${requestBody.username}",` +
      `${scenarioID[0].Id},${requestBody.score},${requestBody.numberOfQuestions},${requestBody.numberOfAnsweredQuestions},${requestBody.correctAnswers},` +
      `${requestBody.wrongAnswers},${requestBody.hintsUsed},${requestBody.fiftyFiftyUsed},${requestBody.time})`

    await connection.query(query)

    connection.release()

    return jsonResponse(200, JSON.stringify('Save Successful'))
  } catch (error) {
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
