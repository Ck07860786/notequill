import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { sendOtp, verifyOtp } from "./controllers/otpController";
import userRoutes from "./routes/userRoutes"; 

// Load environment variables
dotenv.config();

// Validate required env variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env file");
}

// Initialize Express
const app: Application = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.post("/api/send-otp", sendOtp);
app.post("/api/verify-otp", verifyOtp);
app.use("/api/users", userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
