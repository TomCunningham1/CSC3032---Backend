import { handler } from '../../lib/api/register';
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
        RowsUpdated: 1
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

    it('shoud return a 400 when no missing attributes', async () => {
        const results = await handler({
            body: JSON.stringify({
                email: "Test@Test",
                password: "Password"
              })
        });
  
        expect(results.body)
          .toContain("Missing request data");
        expect(results.statusCode).toBe(400);
    });

    it('should return a 200 when', async () => {
      const results = await handler({
        body: JSON.stringify({
          email: "Test@Test",
          password: "Password",
          username: "Test",
          firstName: "Test",
          lastName: "Test"
        })
      });

      expect(results.body)
        .toContain("[{\"RowsUpdated\":1}]");
      expect(results.statusCode).toBe(200);

      expect(queryMock).toHaveBeenCalled();
      expect(connectionMock).toHaveBeenCalled();
      expect(endMock).toHaveBeenCalled();
      expect(promiseMock).toHaveBeenCalled();
      expect(releaseMock).toHaveBeenCalled();
    });
});