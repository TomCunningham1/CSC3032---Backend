import * as nodemailer from 'nodemailer'
import { EMAIL_SERVICE } from '../config/constants'

const sendMail = async (target: string, subject: string, content: string) => {
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE.SERVICE,
    auth: {
      user: EMAIL_SERVICE.USER,
      pass: EMAIL_SERVICE.PASS,
    },
  })

  const mailOptions = {
    from: EMAIL_SERVICE.USER,
    to: target as string,
    subject: subject,
    text: content,
  }

  await transporter.sendMail(mailOptions)
}

export { sendMail }
