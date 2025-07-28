import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Otp from "../models/otpModel"; 

// Send OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  try {
    // Remove old OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp: otpCode, expiresAt });

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  if (!email || typeof email !== "string" || !otp || typeof otp !== "string") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      res.status(400).json({ error: "OTP expired" });
      return;
    }

    // OTP is valid
    await Otp.deleteOne({ _id: record._id }); 
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};
