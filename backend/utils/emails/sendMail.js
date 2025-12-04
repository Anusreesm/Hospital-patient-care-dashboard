import Mailjet from 'node-mailjet';
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";

dotenv.config()
const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

const SendMail = async (toEmail, { subject, text, html }) => {
    try {
        const request = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: process.env.EMAIL_FROM.match(/<(.*)>/)[1],
                            Name: process.env.EMAIL_FROM.split("<")[0].trim()
                        },
                        To: [
                            {
                                Email: toEmail
                            }
                        ],
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html
                    }
                ]
            });

        console.log("Mailjet response:", request.body);
        return request.body;
       
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
       console.error(error);
    }
};


export default SendMail;