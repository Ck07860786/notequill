import mongoose, { Document, Schema } from "mongoose";


export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}


const otpSchema: Schema<IOtp> = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const Otp = mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;
