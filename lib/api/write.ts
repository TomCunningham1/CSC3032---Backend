import * as AWS from 'aws-sdk'
import {
  API_VERSION,
  NON_PRODUCTION_ENVIRONMENT,
  port,
} from '../config/constants'
import { jsonResponse } from '../utils/response-utils'
import { logger } from '../utils/logger-utils'
import { createPool } from 'mysql2'

interface QuestionInterface {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
  explaination: string
  stage: string
}

interface QuestionsInterface {
  questions: QuestionInterface[]
}

// Write Lambda
export const handler = async (event: any): Promise<any> => {
  let scenarioName = ''

  // Return 400 if the body is missing
  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  // Return 400 if the scenario name is missing
  if (event?.queryStringParameters?.scenarioName) {
    scenarioName = event.queryStringParameters.scenarioName
  } else {
    return jsonResponse(400, 'Missing scenario name')
  }

  // Write to dynamo db
  try {
    logger.info(event.body)

    const questions = JSON.parse(event.body)

    logger.info(questions.toString())

    const ddb = new AWS.DynamoDB(API_VERSION)

    const reconnaissanceQuestions = questions.reconnaissance.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const weaponisationQuestions = questions.weaponisation.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const deliveryQuestions = questions.delivery.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const exploitationQuestions = questions.exploitation.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const installationQuestions = questions.installation.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const commandQuestions = questions.command.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const actionsQuestions = questions.actions.map(
      (question: QuestionInterface) => ({
        M: {
          question: { S: question.question },
          optionA: { S: question.optionA },
          optionB: { S: question.optionB },
          optionC: { S: question.optionC },
          optionD: { S: question.optionD },
          answer: { S: question.answer },
          explaination: { S: question.explaination || 'No explaination' },
          stage: { S: question.stage || 'No stage' },
        },
      })
    )
    const params = {
      TableName:
        process.env.TABLE_NAME || NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
      Item: {
        title: { S: scenarioName },
        reconnaissance: { L: reconnaissanceQuestions },
        weaponisation: { L: weaponisationQuestions },
        delivery: { L: deliveryQuestions },
        exploitation: { L: exploitationQuestions },
        installation: { L: installationQuestions },
        command: { L: commandQuestions },
        actions: { L: actionsQuestions },
      },
    }

    await ddb
      .putItem(params, (res, err) => {
        console.error(res, err)
      })
      .promise()
  } catch (e) {
    logger.error(e as unknown as string)
    return jsonResponse(400, 'Error processing scenario questions')
  }

  // Add to scenario table if not already added

  const user = process.env.USERNAME
  const password = process.env.PASSWORD
  const database = process.env.DATABASE
  const host = process.env.HOST

  const dbConfig = {
    host,
    port,
    user,
    password,
    database,
  }

  const conn = createPool(dbConfig).promise()

  const insertScenario = `INSERT IGNORE INTO Scenario (Name) VALUES ("${scenarioName}")`

  try {
    const connection = await conn.getConnection()

    await connection.query(insertScenario)

    connection.release()
  } catch (error) {
    return jsonResponse(400, JSON.stringify(error))
  } finally {
    conn.end()
  }

  return jsonResponse(200, 'Success')
}
