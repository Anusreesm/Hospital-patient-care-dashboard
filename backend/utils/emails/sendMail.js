import nodemailer from 'nodemailer'
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";

dotenv.config()

const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure: false,
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASSWORD,
    }
    })

const SendMail = async (toEmail, { subject, text, html }) => {
    try {
        console.log("useremail",process.env.USER_EMAIL)
        console.log("from email",process.env.EMAIL_FROM)
         transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: toEmail,
            subject,
            text,
            html,
        })
       
       
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
       console.error(error);
    }
};


export default SendMail;