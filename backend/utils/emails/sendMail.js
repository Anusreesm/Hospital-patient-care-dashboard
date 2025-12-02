import nodemailer from 'nodemailer'
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";


dotenv.config({ path: './.env' })

const SendMail = async (toEmail, { subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // port: 587,
            port: 465,
            secure: true, // SSL
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PW
            },
            tls: {
                rejectUnauthorized: false, // bypass cert issues on Render
            },
        })
        // Mail options
        const mailOptions = {
            from: `"MedTech" <${process.env.USER_EMAIL}>`,
            to: toEmail,
            subject,
            text,
            html,
        };

        // Send mail and await response
        const info = await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
        console.log(MESSAGES.COMMON.EMAIL_SEND, info.messageId);
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
    }
};

export default SendMail;