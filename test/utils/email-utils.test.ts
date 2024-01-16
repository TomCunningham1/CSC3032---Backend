import { HackAttackResults, handler } from '../../lib/api/email';
import * as nodemailer from "nodemailer";
import { sendMail } from '../../lib/utils/email-utils';
import { EMAIL_SERVICE } from '../../lib/config/constants';

const mockSendEmail = jest.fn();
const mockSendTransport = jest.fn().mockReturnValue({
    sendMail: mockSendEmail
});

describe('email lambda tests', () => {
    beforeEach(() => {
      jest.spyOn(nodemailer, 'createTransport').mockImplementation(mockSendTransport)
    });

    it('should send an email containing the values passed to the method', async () => {
        sendMail("tom.c22@hotmail.co.uk", "Test", "Test");

        expect(mockSendTransport).toHaveBeenCalledTimes(1);
        expect(mockSendEmail).toHaveBeenCalledTimes(1);
        expect(mockSendEmail).toHaveBeenCalledWith({
            from: EMAIL_SERVICE.USER,
            to: "tom.c22@hotmail.co.uk",
            subject: "Test",
            text: "Test"
        })
    });

});