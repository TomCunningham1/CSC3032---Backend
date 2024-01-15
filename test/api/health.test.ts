import { handler } from '../../lib/api/health';
import * as mysql2 from 'mysql2';


describe('health lambda tests', () => {

    it('should return a 200 status code when the service is online', async () => {
      const results = await handler();

      expect(results.body)
        .toContain("UP");
      expect(results.statusCode).toBe(200);
    });
});