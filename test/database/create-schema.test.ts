import { handler } from '../../lib/database/create-schema';
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
        expect(rdsMock.queryMock).toHaveBeenNthCalledWith(1, "CREATE TABLE IF NOT EXISTS Scenario (Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,Name VARCHAR(255) UNIQUE);");
        expect(rdsMock.queryMock).toHaveBeenNthCalledWith(2, "CREATE TABLE IF NOT EXISTS Attempt (Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,Username VARCHAR(255),ScenarioId INT(6) UNSIGNED,Score Int,NumberOfQuestions int,NumberOfAnsweredQuestions int,CorrectAnswers int,WrongAnswers int,HintsUsed int,FiftyFiftyUsed int,Time int,CONSTRAINT fk_scenario FOREIGN KEY (ScenarioId) REFERENCES Scenario(Id));");
    })
});
