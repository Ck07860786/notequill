import { useEffect, useState } from "react";
import axios from "axios";
import { signOut, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { Loader2, Trash2, User } from "lucide-react";
import { toast } from "react-toastify";
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
  const [creatingNote, setCreatingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

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

    setCreatingNote(true);
    try {
      await axios.post(`${BASE_URL}/api/notes`, {
        email,
        title,
        content,
      });
      setTitle("");
      setContent("");
      fetchNotes(email);
      toast.success("Note created");
    } catch (err) {
      console.error("Error creating note:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCreatingNote(false);
    }
  };

  const deleteNote = async (id: string) => {
    setDeletingNoteId(id);
    try {
      await axios.delete(`${BASE_URL}/api/notes/${id}`);
      fetchNotes(email);
      toast("Note deleted successfully");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Something went wrong");
    } finally {
      setDeletingNoteId(null);
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
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 flex items-center justify-between mb-12 border border-gray-100">
          <div className="flex items-center gap-4">
            {photo ? (
              <img
                src={photo}
                alt="User"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                <User className="w-7 h-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Hello, {name || email}</h1>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium shadow transition"
          >
            Logout
          </button>
        </div>

        {/* Create Note */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-100 rounded-2xl p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">📝 Create a New Note</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your thoughts..."
            rows={4}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={createNote}
            disabled={creatingNote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 disabled:opacity-60"
          >
            {creatingNote && <Loader2 className="animate-spin w-4 h-4" />}
            {creatingNote ? "Saving..." : "Save Note"}
          </button>
        </div>

        {/* Notes List */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📚 Your Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes yet. Start by creating one above!</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-xl transition relative"
                >
                  <h3 className="text-lg font-bold text-blue-700 mb-1">{note.title}</h3>
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-gray-400">
                    Created on {new Date(note.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => deleteNote(note._id)}
                    disabled={deletingNoteId === note._id}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                  >
                    {deletingNoteId === note._id ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
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
