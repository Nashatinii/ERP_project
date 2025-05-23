import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [storedFiles, setStoredFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  useEffect(() => {
    const existingFiles = JSON.parse(localStorage.getItem("files") || "[]");
    setStoredFiles(existingFiles);
  }, []);

  const handleUpload = () => {
    setError("");
    setSuccess("");

    if (!file || !title.trim()) {
      setError("Please select a file and enter a title.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Unsupported file type. Only PDF, Word, and Excel are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    const id = Date.now().toString();

    const newFile = {
      id,
      title: title.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      type: file.type,
      name: file.name,
    };

    const updatedFiles = [...storedFiles, newFile];
    localStorage.setItem("files", JSON.stringify(updatedFiles));
    setStoredFiles(updatedFiles);

    // dispatch event for live update
    window.dispatchEvent(new Event("file-added"));

    // Reset
    setFile(null);
    setTitle("");
    setDescription("");
    setTags("");
    setSuccess("File uploaded successfully!");
  };

  return (
    <motion.div
      className="space-y-4 bg-white rounded-2xl shadow p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
        <UploadCloud size={22} /> Upload Document
      </h3>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Choose File</label>
        <input
          type="file"
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-indigo-100 file:text-indigo-800 hover:file:bg-indigo-200 transition"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <motion.input
          className="border border-gray-300 p-2 rounded w-full"
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />

        <motion.textarea
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          className="border border-gray-300 p-2 rounded w-full"
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        onClick={handleUpload}
      >
        Upload
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.div
            className="text-red-600 flex items-center gap-1 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertTriangle size={16} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            className="text-green-600 flex items-center gap-1 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FileCheck size={16} /> {success}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
