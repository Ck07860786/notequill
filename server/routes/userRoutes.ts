
import express from "express";
import User from "../models/userModel";

const router = express.Router();

// Save or update Google user
router.post("/", async (req, res) => {
  const { name, email, photo } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Check if user already exists
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
});

export default router;
