import { LambdaResponseType } from '../types/response-type'
import { sendMail } from '../utils/email-utils'
import { jsonResponse } from '../utils/response-utils'

interface HackAttackResults {
  target: string
  score: string
  numberOfQuestions: string
  numberOfAnsweredQuestions: string
  correctAnswers: string
  wrongAnswers: string
  hintsUsed: string
  fiftyFiftyUsed: string
}

const handler = async (event: any): Promise<LambdaResponseType> => {
  if (!event?.body) {
    return jsonResponse(400, 'Missing request body')
  }

  const requestBody = JSON.parse(event.body) as unknown as HackAttackResults

  const contents = ` Hack Attack Results \n\n 
    \tScore: \t${requestBody.score}\n
    \tNumber Of Questions: \t${requestBody.numberOfQuestions}\n
    \tNumber Of Answered Questions:\t${requestBody.numberOfAnsweredQuestions}\n
    \tCorrect Answers: \t${requestBody.correctAnswers}\n
    \tIncorrect Answers: \t${requestBody.wrongAnswers}\n
    \tHints Used: \t${requestBody.hintsUsed}\n
    \tFifty Fifties Used: \t${requestBody.fiftyFiftyUsed}`

  await sendMail(requestBody.target, 'Hack Attack Results', contents)

  return jsonResponse(200, JSON.stringify('Message sent successfully'))
}

export { handler, HackAttackResults }
