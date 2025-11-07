import twilio from "twilio";
import dotenv from "dotenv";
import { appointmentReminderBody } from "./whatsappText.js";

dotenv.config({ path: './.env' })

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendTextToken = async (phone, name, token, date, time) => {
  try {
    const body = appointmentReminderBody(name, token, date, time);

    const message = await client.messages.create({
     from: "whatsapp:" + process.env.TWILIO_FROM,
      to: "whatsapp:" + phone,
     body,

    });

    console.log(`WhatsApp message sent to ${phone}`);
    console.log("Message SID:", message.sid);
  } catch (err) {
    console.error("Error sending WhatsApp message:", err);
  }
};
export default sendTextToken