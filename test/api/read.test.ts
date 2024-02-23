import { handler } from '../../lib/api/read';
import * as AWS from 'aws-sdk'
import { dynamoDBMock } from '../mock_utils';

const testEvent = {
    queryStringParameters: {
        scenarioName: 'Test'
    }
}

const resolvedItem = {
    Item: {
        title: { S: 'Test' },
        questions: {
            L: [
                {
                    M: {
                    optionA: { S: 'optionA'},
                    optionB: { S: 'optionB' },
                    optionC: { S: 'optionC' },
                    optionD: { S: 'optionD' },
                    answer: { S: 'answer' },
                    question: { S: 'question' },
                    stage: { S: 'stage' },
                    explaination: { S: 'explaination'}
                }
            }
            ]
        }
    },
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
            ...resolvedItem
        })

        const results = await handler(testEvent)

        expect(results.statusCode).toBe(200)
        expect(results.body).toBe('{"title":"Test","questions":[{"optionC":"optionC","optionB":"optionB","optionA":"optionA","optionD":"optionD","question":"question","stage":"stage","answer":"answer","explaination":"explaination"}]}')
    })

    it('Should return a 400 when a scenario name is not provided', async () => {
        const results = await handler({})

        expect(results.statusCode).toBe(400)
        expect(results.body).toBe('Missing scenario name')
    })

    it('Should return a 404 if no Item is found', async () => {
        dynamoDBMock.promiseMock.mockResolvedValueOnce({
        })
        
        const results = await handler(testEvent)

        expect(results.statusCode).toBe(404)
        expect(results.body).toBe('Scenario Not Found')        
    })

});
