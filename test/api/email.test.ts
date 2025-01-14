import { HackAttackResults, handler } from '../../lib/api/email';
import * as mail from '../../lib/utils/email-utils';
import * as AWSXRay from 'aws-xray-sdk';

const mockSendMail = jest.fn();
const mockGetSegment = jest.fn();

const mockData = {
    body: JSON.stringify({
    target: "test@test.com",
    score: 32,
    numberOfQuestions: 23,
    numberOfAnsweredQuestions: 32,
    correctAnswers: 32,
    wrongAnswers: 32,
    hintsUsed: 32,
    fiftyFiftyUsed: 32
} as HackAttackResults)}

const mockData2 = {
    body: JSON.stringify({
    target: "test@test.com",
    score: 0,
    numberOfQuestions: 0,
    numberOfAnsweredQuestions: 32,
    correctAnswers: 32,
    wrongAnswers: 2,
    hintsUsed: 0,
    fiftyFiftyUsed: 32
} as HackAttackResults)}

const invalidMockData = {
    body: JSON.stringify({
    target: "test@test.com",
    score: 2,
    numberOfQuestions: 2,
    numberOfAnsweredQuestions: 2,
    correctAnswers: 2,
    wrongAnswers: 2,
    fiftyFiftyUsed: 32
} as HackAttackResults)}


describe('email lambda tests', () => {
    
    beforeEach(() => {
      jest.spyOn(mail, 'sendMail').mockImplementation(mockSendMail);
      jest.spyOn(AWSXRay, 'getSegment').mockImplementation(mockGetSegment);
    });

    it('should return a 200 if the content is provided', async () => {
        const results = await handler(mockData);

        expect(results.statusCode).toBe(200);
        expect(results.body).toBe(JSON.stringify("Message sent successfully"))
    });

    it('should return a 400 if the body is missing', async () => {
        const results = await handler({})
        expect(results.statusCode).toBe(400)
        expect(results.body).toBe("Missing request body")
    })
});