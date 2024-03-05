import { handler } from '../../lib/database/insert-data';
import * as sql from 'mysql2'
import { rdsMock } from '../mock_utils';

describe('get all lambda tests', () => {
    
    beforeEach(() => {
        jest.spyOn(sql, 'createPool').mockImplementation(rdsMock.mockDB)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return a 500 if an error occurs when connecting ot the database', async () => {
        rdsMock.connMock.mockReturnValueOnce({})

        const results = await handler({})

        expect(results.statusCode).toBe(500)
    })

    it('should return a 200 if the schema is successfully created', async () => {
        rdsMock.queryMock.mockReturnValue([])
        
        const results = await handler({})

        expect(results.statusCode).toBe(200)
        expect(rdsMock.releaseMock).toHaveBeenCalled()
        expect(rdsMock.connMock).toHaveBeenCalled()
        expect(rdsMock.queryMock).toHaveBeenCalledTimes(2)
    })
});
