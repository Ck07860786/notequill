import { Request, Response } from "express";
import Note from "../models/noteModel";

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  const { email, title, content } = req.body;

  if (!email || !title || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newNote = await Note.create({ email, title, content });
    res.status(201).json({ message: "Note created", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all notes for a user
export const getNotes = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const notes = await Note.find({ email }).sort({ createdAt: -1 });
    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Delete a note by ID
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
};


