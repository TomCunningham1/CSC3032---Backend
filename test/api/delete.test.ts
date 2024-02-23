import { handler } from '../../lib/api/delete';
import * as AWS from 'aws-sdk'
import * as sql from 'mysql2'
import { NON_PRODUCTION_ENVIRONMENT } from '../../lib/config/constants';

const mockData = {
    queryStringParameters: {
        scenarioName: "Test"
    }
}

const mockDeleteItem = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({
        ConsumedCapacity: 'Test Capacity'
    })
})

const mockDynamoDB = jest.fn().mockImplementation(()=> {
    return {
        deleteItem: mockDeleteItem
    }
})

const queryMock = jest.fn()
const connMock = jest.fn()

const mockRdsDB = jest.fn().mockReturnValue({
    promise: jest.fn().mockReturnValue({
        getConnection: connMock.mockReturnValue({
            query: queryMock,
            release: jest.fn()
        }),
        end: jest.fn()
    }),
})

describe('email lambda tests', () => {
    
    beforeEach(() => {
        jest.spyOn(AWS, 'DynamoDB').mockImplementation(mockDynamoDB)
        jest.spyOn(sql, 'createPool').mockImplementation(mockRdsDB)
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
    
        expect(mockDeleteItem).toHaveBeenCalledWith({
            TableName: NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
            Key: {
                title: { S: "Test" }
            }
        })
        expect(queryMock).toHaveBeenNthCalledWith(1, 
            "DELETE FROM Attempt WHERE ScenarioID IN (SELECT Id From Scenario WHERE Name = \"Test\");"
          );

        expect(queryMock).toHaveBeenNthCalledWith(2,
            `DELETE FROM Scenario WHERE Name = "Test"`)
    })

    it('should return a 400 when an error occurs in the query', async () => {
        connMock.mockReturnValueOnce({})
        const results = await handler(mockData)
        
        expect(results.statusCode).toBe(400)
        expect(results.body).toBe("{}")
    })
});