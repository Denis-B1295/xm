import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendEmail = async (email: string, subject: string, text: string, csv: string) => {
  try {
    if(!csv){
      throw 'No csv to send.'
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),  // Convert to number
      secure: true,  // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false  // Add if using self-signed certificates
      }
    } as SMTPTransport.Options)
  
    await transporter.sendMail({
      from: '"Stock Service" <stocks@example.com>',
      to: email,
      subject,
      text,
      attachments: [{
        filename: 'historical_data.csv',
        content: csv,
      }],
    });
  } catch(error) {
    throw `Error while sending email: ${error}`;
  }
};