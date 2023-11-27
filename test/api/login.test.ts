import { handler } from '../../lib/api/login';
import * as mysql2 from 'mysql2';

const endMock = jest.fn();
const releaseMock = jest.fn();
const queryMock = jest.fn();
const connectionMock = jest.fn();
const promiseMock = jest.fn();
const createPoolMock = jest.fn();

const createPool = createPoolMock.mockReturnValue({
  promise: promiseMock.mockReturnValue({
    getConnection: connectionMock.mockReturnValue({
      query: queryMock.mockReturnValue([[{
        Username: "Test",
        FirstName: "Test",
        LastName: "Test",
        Email: "Email@Test.com"
      }]]),
      release: releaseMock
    }),
  end: endMock
  })
});

describe('login lambda tests', () => {
    beforeEach(() => {
      jest.spyOn(mysql2, 'createPool').mockImplementation(createPool)

    });

    it('shoud return a 400 when no body is provided', async () => {
      const results = await handler({
        headers: ""
      });

      expect(results.body)
        .toContain("Missing request body");
      expect(results.statusCode).toBe(400);
    });

    it('should return a 200 when', async () => {
      const results = await handler({
        body: JSON.stringify({
          email: "Test@Test",
          password: "Password"
        })
      });

      expect(results.body)
        .toContain("{\"Username\":\"Test\",\"FirstName\":\"Test\",\"LastName\":\"Test\",\"Email\":\"Email@Test.com\"}");
      expect(results.statusCode).toBe(200);

      expect(queryMock).toHaveBeenCalled();
      expect(connectionMock).toHaveBeenCalled();
      expect(endMock).toHaveBeenCalled();
      expect(promiseMock).toHaveBeenCalled();
      expect(releaseMock).toHaveBeenCalled();
    });
});