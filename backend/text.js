// Source - https://stackoverflow.com/a
// Posted by Gour Chandra Saha
// Retrieved 2025-12-02, License - CC BY-SA 4.0

import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.support_email,
      pass: config.support_email_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailData = {
    from: config.support_email,
    to,
    subject,
    html,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};