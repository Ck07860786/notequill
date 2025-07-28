import { useEffect, useState } from "react";
import axios from "axios";
import { signOut, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { User } from "lucide-react";
import { BASE_URL } from "../helper/port";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "";
    const userName = localStorage.getItem("userName") || "";
    const userPhoto = localStorage.getItem("userPhoto") || "";

    setEmail(userEmail);
    setName(userName);
    setPhoto(userPhoto);

    if (userEmail) fetchNotes(userEmail);
  }, []);

  const fetchNotes = async (email: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/notes?email=${email}`);
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const createNote = async () => {
    if (!title || !content || !email) return;

    try {
      await axios.post(`${BASE_URL}/api/notes`, {
        email,
        title,
        content,
      });
      setTitle("");
      setContent("");
      fetchNotes(email);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
       
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-6 flex items-center justify-between mb-10 border border-gray-200">
          <div className="flex items-center gap-4">
            {photo ? (
              <img
                src={photo}
                alt="User"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                <User className="w-7 h-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {name || email}</h1>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
          >
            Logout
          </button>
        </div>

        {/* Create Note */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 Create a New Note</h2>
          <input
            type="text"
            placeholder="Note Title"
            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Note Content"
            rows={4}
            className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={createNote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Save Note
          </button>
        </div>

        {/* Notes List */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Your Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes found. Start by creating one!</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white border border-gray-200 p-5 rounded-lg shadow hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-bold text-blue-700 mb-1">{note.title}</h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-gray-400">
                    Created on {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
