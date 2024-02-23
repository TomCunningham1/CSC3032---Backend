import { handler } from '../../lib/api/delete';
import * as AWS from 'aws-sdk'
import * as sql from 'mysql2'
import { NON_PRODUCTION_ENVIRONMENT } from '../../lib/config/constants';
import { dynamoDBMock, rdsMock } from '../mock_utils';

const mockData = {
    queryStringParameters: {
        scenarioName: "Test"
    }
}

describe('email lambda tests', () => {
    
    beforeEach(() => {
        jest.spyOn(AWS, 'DynamoDB').mockImplementation(dynamoDBMock.mockDynamoDB)
        jest.spyOn(sql, 'createPool').mockImplementation(rdsMock.mockDB)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return a 400 if the scenario name is not included', async () => {
        const results = await handler({})

        expect(results.statusCode).toBe(400)
        expect(results.body).toBe('Missing scenario name')
    })

    it('should return a 200 when the scenario is successfully deleted', async () => {
        const results = await handler(mockData)

        expect(results.statusCode).toBe(200)
        expect(results.body).toBe("{\"ConsumedCapacity\":\"Test Capacity\"}")
    
        expect(dynamoDBMock.functionMock).toHaveBeenCalledWith({
            TableName: NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
            Key: {
                title: { S: "Test" }
            }
        })
        expect(rdsMock.queryMock).toHaveBeenNthCalledWith(1, 
            "DELETE FROM Attempt WHERE ScenarioID IN (SELECT Id From Scenario WHERE Name = \"Test\");"
          );

        expect(rdsMock.queryMock).toHaveBeenNthCalledWith(2,
            `DELETE FROM Scenario WHERE Name = "Test"`)
    })

    it('should return a 400 when an error occurs in the query', async () => {
        rdsMock.connMock.mockReturnValueOnce({})
        const results = await handler(mockData)
        
        expect(results.statusCode).toBe(400)
        expect(results.body).toBe("{}")
    })
});