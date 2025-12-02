import nodemailer from 'nodemailer'
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";


dotenv.config({ path: './.env' })

const SendMail = async (toEmail, { subject, text, html }) => {
    try {
        // Add this at the start of SendMail function
console.log("USER_EMAIL:", process.env.USER_EMAIL);
console.log("APP_PW exists:", !!process.env.APP_PW);
console.log("APP_PW length:", process.env.APP_PW?.length); // Should be 16
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
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
        console.log("Email sent successfully:", info.messageId);
        return info; // Return success info
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
         throw error;
    }
};

export default SendMail;