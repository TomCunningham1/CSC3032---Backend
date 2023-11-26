import { handler } from '../../lib/api/login';
import * as mysql2 from 'mysql2';

// const conn = {
//   promise: jest.fn(),
//   getConnection: jest.fn(),
//   query: jest.fn(),
//   connection: jest.fn(),
//   release: jest.fn(),
//   end: jest.fn()
// }

// const createPool = jest.fn()
//   .mockReturnValue(conn);



describe('login lambda tests', () => {
    // beforeEach(() => {
    //   jest.spyOn(mysql2, 'createPool').mockImplementation(createPool);
    // });

    it('shoud return a 400 when no body is provided', async () => {
      const results = await handler({
        body: JSON.stringify('')
      });

      expect(results.body)
        .toContain("Missing request body");
      expect(results.statusCode).toBe(400);
    });

    it('', async () => {
      const results = await handler({
        body: JSON.stringify({
          email: "Test@Test",
          password: "Password"
        })
      });

      expect(results.body)
        .toContain("Missing request body");
      expect(results.statusCode).toBe(400);
    });
});