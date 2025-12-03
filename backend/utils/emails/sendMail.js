import nodemailer from 'nodemailer'
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";


dotenv.config({ path: './.env' })

const SendMail = async (toEmail, { subject, text, html }) => {
    try {

        console.log("USER_EMAIL:", process.env.USER_EMAIL);
        console.log("APP_PW exists:", !!process.env.APP_PW);
        console.log("APP_PW length:", process.env.APP_PW?.length); // Should be 16

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PW
            },
            tls: {
                rejectUnauthorized: false, // bypass cert issues on Render
            },
        });
        // Mail options
        const mailOptions = {
            from: `"MedTech" <${process.env.USER_EMAIL}>`,
            to: toEmail,
            subject,
            text,
            html,
        };

        // Send mail and await response
     const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
    return info; // Return success info
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
        throw error;
    }
};


export default SendMail;