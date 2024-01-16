import { LambdaResponseType } from '../types/response-type'
import { logger } from '../utils/logger-utils'
import { jsonResponse } from '../utils/response-utils'

export const handler = async (): Promise<LambdaResponseType> => {
  logger.info('Service Online')

  return jsonResponse(200, 'UP')
}
