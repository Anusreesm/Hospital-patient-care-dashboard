import nodemailer from 'nodemailer'
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";


dotenv.config({ path: './.env' })

const SendMail = async (toEmail, { subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PW
            }
        })
        const info = await transporter.sendMail({
            from: `"MedTech" <${process.env.USER_EMAIL}>`,
            to: toEmail,
            subject,
            text,
            html
        });
        console.log(MESSAGES.COMMON.EMAIL_SEND, info.messageId);
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
    }
};

export default SendMail;