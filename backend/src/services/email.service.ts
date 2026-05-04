import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async ({ to, subject, text, html }: { to: string, subject: string, text: string, html?: string }) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log(`[MOCK EMAIL SERVICE] To: ${to} | Subject: ${subject} | Text: ${text}`);
            return Promise.resolve(true);
        }

        const info = await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME || 'SmartHR'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: html || text, // Fallback to text if html is not provided
        });

        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
