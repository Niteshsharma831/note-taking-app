import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast, Toaster } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  title: string;
  content: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/notes/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes);
        setUser(res.data.user);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load notes");
      }
    };
    fetchData();
  }, []);

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const res = await API.post(
        "/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([res.data.note, ...notes]);
      setTitle("");
      setContent("");
      toast.success("Note created");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <Toaster />
      <div className="max-w-6xl mx-auto space-y-6 border border-gray-300 bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                      10-4.48 10-10S17.52 2 12 2zm-1 
                      15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 
                      8l-9 9z"
              />
            </svg>
            <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-blue-600 hover:underline"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        {user && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="text-lg font-bold text-gray-800">
              Welcome, {user.name}!
            </p>
            <p className="text-sm text-gray-600">Email: {user.email}</p>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-blue-600 text-white py-2 rounded shadow mb-6"
        >
          {showForm ? "Cancel" : "Create Note"}
        </button>

        {/* Conditional Layout */}
        {showForm ? (
          // ✅ Show two-column layout when form is open
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4 shadow">
              <h2 className="text-md font-semibold mb-3 text-gray-700">
                Create a New Note
              </h2>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-2 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={handleAddNote}
                className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
              >
                Save Note
              </button>
            </div>

            {/* Right: Notes */}
            <div className="space-y-3">
              <h3 className="text-gray-800 font-medium mb-2">Your Notes</h3>
              {notes.length === 0 ? (
                <p className="text-sm text-gray-400">No notes yet.</p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-gray-100 rounded p-3 shadow-sm cursor-pointer"
                    onClick={() =>
                      setExpandedNoteId(
                        expandedNoteId === note._id ? null : note._id
                      )
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        {note.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note._id);
                        }}
                      >
                        <Trash2
                          size={16}
                          className="text-red-500 hover:text-red-600"
                        />
                      </button>
                    </div>
                    {expandedNoteId === note._id && (
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          // 🟦 Default view — Notes only
          <div className="space-y-3">
            <h3 className="text-gray-800 font-medium mb-2">Your Notes</h3>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400">No notes yet.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-gray-100 rounded p-3 shadow-sm cursor-pointer"
                  onClick={() =>
                    setExpandedNoteId(
                      expandedNoteId === note._id ? null : note._id
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {note.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note._id);
                      }}
                    >
                      <Trash2
                        size={16}
                        className="text-red-500 hover:text-red-600"
                      />
                    </button>
                  </div>
                  {expandedNoteId === note._id && (
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
