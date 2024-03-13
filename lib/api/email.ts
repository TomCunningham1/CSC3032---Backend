import { LambdaResponseType } from '../types/response-type'
import { sendMail } from '../utils/email-utils'
import { jsonResponse } from '../utils/response-utils'
import * as AWSXRay from 'aws-xray-sdk'

const id = 'send-email-lambda'

interface HackAttackResults {
  target: string
  score: number
  numberOfQuestions: number
  numberOfAnsweredQuestions: number
  correctAnswers: number
  wrongAnswers: number
  hintsUsed: number
  fiftyFiftyUsed: number
  time: number
}

const handler = async (event: any): Promise<LambdaResponseType> => {
  // Set up AWS XRay Segment

  const segment = AWSXRay.getSegment()
  const validationSubSegment = segment?.addNewSubsegment(`${id}-validation`)

  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  const requestBody = JSON.parse(event.body) as unknown as HackAttackResults

  validationSubSegment?.close()
  const nodemailerSegment = segment?.addNewSubsegment(`${id}-nodemailer`)

  const contents = `Hack Attack Results\n\n 
    \tScore: \t${requestBody.score}\n
    \tNumber Of Questions: \t${requestBody.numberOfQuestions}\n
    \tNumber Of Answered Questions:\t${requestBody.numberOfAnsweredQuestions}\n
    \tCorrect Answers: \t${requestBody.correctAnswers}\n
    \tIncorrect Answers: \t${requestBody.wrongAnswers}\n
    \tHints Used: \t${requestBody.hintsUsed}\n
    \tFifty Fifties Used: \t${requestBody.fiftyFiftyUsed}\n
    \tTime: \t${requestBody.time}`

  await sendMail(requestBody.target, 'Hack Attack Results', contents)

  nodemailerSegment?.close()

  return jsonResponse(200, JSON.stringify('Message sent successfully'))
}

export { handler, HackAttackResults }
