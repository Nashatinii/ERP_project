import React, { useState, useEffect, useRef } from "react";
import { Tag, PlusCircle, Trash2, Edit3, Save, XCircle } from "lucide-react";

export default function TagManager() {
  const [documents, setDocuments] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [tag, setTag] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [newTagValue, setNewTagValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const loadFiles = () => {
      const storedFiles = JSON.parse(localStorage.getItem("files") || "[]");
      setDocuments(storedFiles);
    };

    loadFiles(); // Initial load

    const handleFileAdded = () => {
      loadFiles(); // Reload on new file upload
    };

    window.addEventListener("file-added", handleFileAdded);

    return () => {
      window.removeEventListener("file-added", handleFileAdded);
    };
  }, []);

  const updateStorage = (updatedDocs) => {
    localStorage.setItem("files", JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
    window.dispatchEvent(new Event("data-changed"));
  };

  const addTag = () => {
    setError("");

    if (!documentId.trim()) {
      setError("📄 Please enter a Document ID.");
      return;
    }

    if (!tag.trim()) {
      setError("🏷️ Please enter a tag.");
      return;
    }

    const docExists = documents.some((doc) => doc.id === documentId);
    if (!docExists) {
      setError(`❌ Document with ID "${documentId}" does not exist.`);
      return;
    }

    const updated = documents.map((doc) => {
      if (doc.id === documentId) {
        const currentTags = doc.tags || [];
        return {
          ...doc,
          tags: [...new Set([...currentTags, tag.trim()])],
        };
      }
      return doc;
    });

    updateStorage(updated);
    setTag("");
  };

  const removeTag = (docId, tagToRemove) => {
    const updated = documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          tags: (doc.tags || []).filter((t) => t !== tagToRemove),
        };
      }
      return doc;
    });

    updateStorage(updated);
  };

  const startEdit = (docId, currentTag) => {
    setEditingTag({ docId, currentTag });
    setNewTagValue(currentTag);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const saveEditedTag = () => {
    if (!newTagValue.trim()) {
      setError("Tag cannot be empty.");
      return;
    }

    const { docId, currentTag } = editingTag;
    const updated = documents.map((doc) => {
      if (doc.id === docId) {
        const newTags = (doc.tags || []).map((t) =>
          t === currentTag ? newTagValue.trim() : t
        );
        return { ...doc, tags: newTags };
      }
      return doc;
    });

    updateStorage(updated);
    setEditingTag(null);
    setNewTagValue("");
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
        <Tag size={24} /> Tag Management
      </h3>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded flex items-center gap-2 mb-2">
          <XCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Document ID"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>

      <button
        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        onClick={addTag}
      >
        <PlusCircle size={18} /> Add Tag
      </button>

      {documents.filter((doc) => doc.tags?.length).length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Title</th>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {documents
                .filter((doc) => doc.tags?.length)
                .map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2"><strong>{doc.title}</strong></td>
                    <td className="border border-gray-300 p-2">{doc.id}</td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex flex-wrap gap-2">
                     {doc.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full text-sm"
                          >
                           <strong>TAGS:</strong>  {editingTag?.docId === doc.id &&
                            editingTag?.currentTag === t ? (
                              <> 
                                <input
                                  ref={inputRef}
                                  className="border px-2 py-1 rounded text-sm"
                                  value={newTagValue}
                                  onChange={(e) =>
                                    setNewTagValue(e.target.value)
                                  }
                                />
                                <button
                                  className="text-green-600"
                                  onClick={saveEditedTag}
                                >
                                  <Save size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                {t}
                                <button
                                  className="text-yellow-600"
                                  onClick={() => startEdit(doc.id, t)}
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  className="text-red-600"
                                  onClick={() => removeTag(doc.id, t)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
