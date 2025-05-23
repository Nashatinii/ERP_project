import React, { useEffect, useState } from "react";
import { Folder, Trash2, PlusCircle, Edit3, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function FolderManager() {
  const [folders, setFolders] = useState([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("folders") || "[]");
    setFolders(stored);
  }, []);

  const updateStorage = (updated) => {
    localStorage.setItem("folders", JSON.stringify(updated));
    setFolders(updated);
  };

  const createFolder = () => {
    if (!name.trim()) {
      setError("Folder name cannot be empty.");
      return;
    }

    const newFolder = {
      id: uuidv4(),
      name: name.trim(),
      parentId: parentId || null,
    };

    const updated = [...folders, newFolder];
    updateStorage(updated);
    setName("");
    setParentId("");
    setError("");
  };

  const deleteFolder = (id) => {
    const updated = folders.filter((f) => f.id !== id && f.parentId !== id);
    updateStorage(updated);
  };

  const startEdit = (folder) => {
    setEditingFolder(folder.id);
    setNewFolderName(folder.name);
  };

  const saveEdit = () => {
    if (!newFolderName.trim()) {
      setError("Folder name cannot be empty.");
      return;
    }

    const updated = folders.map((f) =>
      f.id === editingFolder ? { ...f, name: newFolderName.trim() } : f
    );
    updateStorage(updated);
    setEditingFolder(null);
    setNewFolderName("");
    setError("");
  };

 return (
  <div className="mt-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
      <Folder size={24} /> Folder Management
    </h3>

    {error && <p className="text-red-600 mb-3">{error}</p>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <input
        className="border p-2 rounded w-full"
        placeholder="Folder Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 rounded w-full"
        placeholder="Parent Folder ID (optional)"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
      />
    </div>

    <button
      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
      onClick={createFolder}
    >
      <PlusCircle size={18} /> Create Folder
    </button>

    <div className="mt-6 space-y-4">
      {folders.map((folder) => (
        <div key={folder.id} className="bg-white shadow rounded p-4 flex justify-between items-center">
          <div>
            <div className="text-gray-700 font-semibold">ID: <span className="font-normal">{folder.id}</span></div>
            <div className="text-gray-700 font-semibold">
              Name:{" "}
              {editingFolder === folder.id ? (
                <input
                  className="border px-2 py-1 rounded"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              ) : (
                folder.name
              )}
            </div>
            {folder.parentId && (
              <div className="text-gray-600">Parent ID: {folder.parentId}</div>
            )}
          </div>
          <div className="flex gap-2">
            {editingFolder === folder.id ? (
              <button className="text-green-600" onClick={saveEdit}>
                <Save size={20} />
              </button>
            ) : (
              <button className="text-yellow-600" onClick={() => startEdit(folder)}>
                <Edit3 size={20} />
              </button>
            )}
            <button className="text-red-600" onClick={() => deleteFolder(folder.id)}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)
}
