import { Request, Response } from "express";
import User from "../models/userModel";

// Save or update user
export const saveOrUpdateUser = async (req: Request, res: Response) => {
  const { name, email, photo } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.name = name;
      user.photo = photo;
      await user.save();
    } else {
      user = await User.create({ name, email, photo });
    }

    res.status(200).json({ message: "User stored", user });
  } catch (err) {
    console.error("User saving failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
