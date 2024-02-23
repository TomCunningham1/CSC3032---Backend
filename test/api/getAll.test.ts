import { handler } from '../../lib/api/getAll';
import * as AWS from 'aws-sdk'
import { NON_PRODUCTION_ENVIRONMENT } from '../../lib/config/constants';

const testParams = {
    TableName: NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
    ProjectionExpression: 'title'
}

const promiseMock = jest.fn()
const scanMock = jest.fn().mockReturnValue({
    promise: promiseMock.mockResolvedValue({
        Items: [{ title: { S: 'SQL Injection'}}, { title: { S: 'Cross Site Scripting'}}],
        ConsumedCapacity: 'Test Capacity'
    })
})

const mockDynamoDB = jest.fn().mockImplementation(()=> {
    return {
        scan: scanMock
    }
})

describe('get all lambda tests', () => {
    
    beforeEach(() => {
        jest.spyOn(AWS, 'DynamoDB').mockImplementation(mockDynamoDB)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should return a 200 when the a request is sent to the handler', async () => {
        const results = await handler({})

        expect(results.statusCode).toBe(200)
        expect(results.body).toBe("[\"SQL Injection\",\"Cross Site Scripting\"]")
    })

    it('Should return a 400 if an error occurs when accessing dynamodb', async () => {
        promiseMock.mockReturnValueOnce({})

        const results = await handler({})

        expect(results.statusCode).toBe(400)
    })

});
