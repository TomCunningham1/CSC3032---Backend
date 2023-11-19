import { LambdaResponseType } from '../types/response-type'
import { jsonResponse } from '../utils/response-utils';

export const handler = async (): Promise<LambdaResponseType> => {
  return jsonResponse(200, 'UP');
}
