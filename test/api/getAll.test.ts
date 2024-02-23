import { handler } from '../../lib/api/getAll';
import * as AWS from 'aws-sdk'
import { NON_PRODUCTION_ENVIRONMENT } from '../../lib/config/constants';
import { dynamoDBMock } from '../mock_utils';

const testParams = {
    TableName: NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
    ProjectionExpression: 'title'
}

describe('get all lambda tests', () => {
    
    beforeEach(() => {
        jest.spyOn(AWS, 'DynamoDB').mockImplementation(dynamoDBMock.mockDynamoDB)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should return a 200 when the a request is sent to the handler', async () => {
        dynamoDBMock.promiseMock.mockResolvedValueOnce({
            Items: [{ title: { S: 'SQL Injection'}}, { title: { S: 'Cross Site Scripting'}}],
            ConsumedCapacity: 'Test Capacity'
        })

        const results = await handler({})

        expect(results.statusCode).toBe(200)
        expect(results.body).toBe("[\"SQL Injection\",\"Cross Site Scripting\"]")
    })

    it('Should return a 400 if an error occurs when accessing dynamodb', async () => {
        dynamoDBMock.promiseMock.mockReturnValueOnce({})

        const results = await handler({})

        expect(results.statusCode).toBe(400)
    })

});
