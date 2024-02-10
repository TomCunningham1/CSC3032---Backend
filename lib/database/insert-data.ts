import { port } from '../config/constants'
import { LambdaResponseType } from '../types/response-type'
import { createPool } from 'mysql2'
import { jsonResponse } from '../utils/response-utils'
import environment from '../config/environment'
import { logger } from '../utils/logger-utils'

const scenario =
  `INSERT INTO Scenario (Name) VALUES ` +
  `("SQL Injection"),` +
  `("Cross Site Scripting"),` +
  `("Distributed Denial Of Service"),` +
  `("Buffer Overflow")`

const attempt = `INSERT INTO Attempt (Username, ScenarioId, Score, NumberOfQuestions, NumberOfAnsweredQuestions, CorrectAnswers, WrongAnswers, HintsUsed, FiftyFiftyUsed, Time) VALUES 
("Tom1234234", 1, 23, 19, 10, 12, 3, 3, 3, 3),
("Tom1334234", 1, 22, 19, 12, 12, 3, 3, 3, 3),
("Tom1334234", 1, 21, 19, 14, 10, 3, 3, 3, 3),
("Tom1334234", 1, 21, 19, 16, 13, 3, 3, 3, 3),
("Tom1334234", 1, 13, 19, 19, 16, 3, 3, 3, 3),
("Tom1334234", 1, 10, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 1, 12, 19, 10, 14, 3, 3, 3, 3),
("Tom1334234", 1, 113, 19, 8, 13, 3, 3, 3, 3),
("Tom1334234", 1, 14, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 1, 15, 19, 19, 18, 3, 3, 3, 3),
("Tom1234234", 2, 23, 19, 10, 12, 3, 3, 3, 3),
("Tom1334234", 2, 22, 19, 12, 12, 3, 3, 3, 3),
("Tom1334234", 2, 21, 19, 14, 10, 3, 3, 3, 3),
("Tom1334234", 2, 21, 19, 16, 13, 3, 3, 3, 3),
("Tom1334234", 2, 13, 19, 19, 16, 3, 3, 3, 3),
("Tom1334234", 2, 10, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 2, 12, 19, 10, 14, 3, 3, 3, 3),
("Tom1334234", 2, 113, 19, 8, 13, 3, 3, 3, 3),
("Tom1334234", 2, 14, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 2, 15, 19, 19, 18, 3, 3, 3, 3),
("Tom1234234", 3, 23, 19, 10, 12, 3, 3, 3, 3),
("Tom1334234", 3, 22, 19, 12, 12, 3, 3, 3, 3),
("Tom1334234", 3, 21, 19, 14, 10, 3, 3, 3, 3),
("Tom1334234", 3, 21, 19, 16, 13, 3, 3, 3, 3),
("Tom1334234", 3, 13, 19, 19, 16, 3, 3, 3, 3),
("Tom1334234", 3, 10, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 3, 12, 19, 10, 14, 3, 3, 3, 3),
("Tom1334234", 3, 113, 19, 8, 13, 3, 3, 3, 3),
("Tom1334234", 3, 14, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 3, 15, 19, 19, 18, 3, 3, 3, 3),
("Tom1234234", 4, 23, 19, 10, 12, 3, 3, 3, 3),
("Tom1334234", 4, 22, 19, 12, 12, 3, 3, 3, 3),
("Tom1334234", 4, 21, 19, 14, 10, 3, 3, 3, 3),
("Tom1334234", 4, 21, 19, 16, 13, 3, 3, 3, 3),
("Tom1334234", 4, 13, 19, 19, 16, 3, 3, 3, 3),
("Tom1334234", 4, 10, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 4, 12, 19, 10, 14, 3, 3, 3, 3),
("Tom1334234", 4, 113, 19, 8, 13, 3, 3, 3, 3),
("Tom1334234", 4, 14, 19, 12, 15, 3, 3, 3, 3),
("Tom1334234", 4, 15, 19, 19, 18, 3, 3, 3, 3);`

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

    logger.info('Successfully inserted test data')

    return jsonResponse(200, 'Schema successfully created')
  } catch (error) {
    logger.error('Error occured when inserting test data')
    logger.error(error as string)

    return jsonResponse(500, JSON.stringify(error))
  } finally {
    conn.end()
  }
}
