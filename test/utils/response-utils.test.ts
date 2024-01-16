import { HackAttackResults, handler } from '../../lib/api/email';
import * as mail from '../../lib/utils/email-utils';
import { jsonResponse } from '../../lib/utils/response-utils';


describe('response utils tests', () => {

    it('should return the status code which is passed to it', () => {
        const results = jsonResponse(200, "Test");
        expect(results.statusCode).toBe(200);
    })

    it('should return the correct body', () => {
        const results = jsonResponse(200, "Test");
        expect(results.body).toBe("Test");
    })

    it('should return the correct headers', () => {
        const results = jsonResponse(200, "Test");
        expect(JSON.stringify(results.headers)).toBe(JSON.stringify({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          }));
    })
});