import * as AWS from 'aws-sdk'

import { API_VERSION, NON_PRODUCTION_ENVIRONMENT } from '../config/constants'
import { jsonResponse } from '../utils/response-utils'
import { logger } from '../utils/logger-utils'
import { Question } from 'aws-sdk/clients/wellarchitected'

interface QuestionInterface {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
  stage: string
  explanation: string
}

interface QuestionsInterface {
  questions: QuestionInterface[]
}

export const handler = async (event: any): Promise<any> => {
  let scenarioName = ''

  logger.info(event)

  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  if (event?.queryStringParameters?.scenarioName) {
    scenarioName = event.queryStringParameters.scenarioName
  } else {
    return jsonResponse(400, 'Missing path parameters')
  }

  try {
    logger.info(event.body)

    const questions = JSON.parse(event.body).questions as QuestionInterface[]

    logger.info(questions.toString())

    const ddb = new AWS.DynamoDB(API_VERSION)

    const questionsAttribute = questions.map((question: QuestionInterface) => ({
      M: {
        question: { S: question.question },
        optionA: { S: question.optionA },
        optionB: { S: question.optionB },
        optionC: { S: question.optionC },
        optionD: { S: question.optionD },
        answer: { S: question.answer },
        stage: { S: question.stage },
        explaination: { S: question.explanation }
      },
    }))

    const params = {
      TableName:
        process.env.TABLE_NAME || NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
      Item: {
        title: { S: scenarioName },
        questions: { L: questionsAttribute },
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

  return jsonResponse(200, 'Success')
}
