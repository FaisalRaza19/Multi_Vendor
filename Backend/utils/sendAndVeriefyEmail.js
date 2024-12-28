import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const verificationCode = generateVerificationCode();
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
        });

        return verificationCode;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification code");
    }
};

const verifyEmail = (userCode, sessionCode) => {
    if (!userCode || !sessionCode) {
        throw new Error("Verification code is required.");
    }
    if (parseInt(userCode) !== parseInt(sessionCode)) {
        throw new Error("Invalid verification code.");
    }
    return true;
};

export { sendEmail, verifyEmail };