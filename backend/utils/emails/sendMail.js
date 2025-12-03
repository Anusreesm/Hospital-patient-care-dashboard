import sgMail from "@sendgrid/mail"; 
import dotenv from "dotenv";

import { MESSAGES } from "../../constants/messages.js";


dotenv.config({ path: './.env' })

const SendMail = async (toEmail, { subject, text, html }) => {
    try {
        
        console.log("FROM_EMAIL:", process.env.FROM_EMAIL);
        console.log("SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY);
       


       sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Mail options
        const mailOptions = {
            from: `"MedTech" <${process.env.FROM_EMAIL}>`,
            to: toEmail,
            subject,
            text,
            html,
        };

        // Send mail and await response
    const response = await sgMail.send(mailOptions);
    console.log("SendGrid Email Sent:", response[0].statusCode);
    return response;
            
    } catch (error) {
        console.error(MESSAGES.COMMON.EMAIL_ERROR, error);
        throw error;
    }
};

export default SendMail;