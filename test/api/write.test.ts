import { handler } from '../../lib/api/write';
import * as AWS from 'aws-sdk'
import { NON_PRODUCTION_ENVIRONMENT } from '../../lib/config/constants';
import * as sql from 'mysql2'
import { rdsMock, dynamoDBMock } from '../mock_utils';

const testParams = {
    TableName: NON_PRODUCTION_ENVIRONMENT.dynamodbTableName,
    ProjectionExpression: 'title'
}

const testEvent = {
    queryStringParameters: {
        scenarioName: 'Test'
    },
    body: JSON.stringify({
        questions: [
            {
                question: "Test",
                optionA: "optionA",
                optionB: "optionB",
                optionC: "optionC",
                optionD: "optionD",
                answer: "optionD",
                stage: "stage",
                explaination: "explaination"
            }
        ]
    })
}

describe('get all lambda tests', () => {
    
    beforeEach(() => {
        jest.spyOn(AWS, 'DynamoDB').mockImplementation(dynamoDBMock.mockDynamoDB)
        jest.spyOn(sql, 'createPool').mockImplementation(rdsMock.mockDB)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should return a 400 if the scenario name is missing', async () => {
        const result = await handler({
            body: {}
        })

        expect(result.statusCode).toBe(400)
        expect(result.body).toBe('Missing scenario name')
    })

    it('Should return a 400 if the body is missing', async () => {
        const result = await handler({})

        expect(result.statusCode).toBe(400)
        expect(result.body).toBe('Missing request body')
    })

    it('Should return a 400 if there is an error with dynamodb', async () => {
        dynamoDBMock.functionMock.mockReturnValueOnce([])
        
        const result = await handler(testEvent)

        expect(result.statusCode).toBe(400)
        expect(result.body).toBe('Error processing scenario questions')
    })

    it('Should return a 200 when a valid request body is passed to the handler', async () => {
        const result = await handler(testEvent)

        expect(result.statusCode).toBe(200)
        expect(result.body).toBe('Success')
        expect(rdsMock.endMock).toHaveBeenCalled()
    })

});
