// export const appointmentReminderTemplate = (name, token, date, time) => ({
//   contentSid: process.env.TWILIO_CONTENT_SID,
//   contentVariables: JSON.stringify({
//    "1": name,
//     "2": token,
//     "3": date,
//     "4": time,
//   }),
// });
// whatsappText.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
export const appointmentReminderBody = (name, token, date, time) => {
  return `Hello ${name}, 
Your appointment token is *${token}*.
Your appointment is scheduled on *${date}* at *${time}*.
Thank you for choosing our service! 
MEDTECH`;
};
