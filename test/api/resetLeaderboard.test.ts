import { handler } from '../../lib/api/resetLeaderboard';
import * as sql from 'mysql2'
import { rdsMock } from '../mock_utils';



describe('reset leaderboard tests', () => {
    
    beforeEach(() => {
        jest.spyOn(sql, 'createPool').mockImplementation(rdsMock.mockDB)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return a 200 if the table is successfully reset', async () => {
        rdsMock.queryMock.mockResolvedValueOnce([])
        
        const result = await handler({});

        expect(result.statusCode).toBe(200)
        expect(result.body).toBe("Table successfully reset")
        expect(rdsMock.queryMock).toHaveBeenCalledWith('DELETE FROM Attempt')
    })

    it('Should return a 400 if an error occurs when connecting to the database', async () => {
        rdsMock.connMock.mockReturnValueOnce({})

        const result = await handler({})

        expect(result.statusCode).toBe(400)
    })
});