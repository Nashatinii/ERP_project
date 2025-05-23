import React, { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessControl() {
  const [documentId, setDocumentId] = useState("");
  const [userId, setUserId] = useState("");
  const [permission, setPermission] = useState("view");
  const [acl, setAcl] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedACL = JSON.parse(localStorage.getItem("acl") || "[]");
    setAcl(storedACL);

    const handleStorageChange = () => {
      const updatedACL = JSON.parse(localStorage.getItem("acl") || "[]");
      setAcl(updatedACL);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAssign = () => {
    setError("");

    const documents = JSON.parse(localStorage.getItem("files") || "[]");
    const docExists = documents.some((doc) => doc.id === documentId.trim());

    if (!documentId || !userId) {
      setError("⚠️ Please enter both Document ID and User ID.");
      return;
    }

    if (!docExists) {
      setError(`❌ Document with ID "${documentId}" does not exist.`);
      return;
    }

    const updatedACL = [
      ...acl.filter(
        (entry) =>
          !(entry.documentId === documentId && entry.userId === userId)
      ),
      { documentId, userId, permission },
    ];

    localStorage.setItem("acl", JSON.stringify(updatedACL));
    setAcl(updatedACL);

    // حدث إعلام التغيير
    window.dispatchEvent(new Event("data-changed"));

    setDocumentId("");
    setUserId("");
    setPermission("view");
  };

  const handleDelete = (documentIdToDelete, userIdToDelete) => {
    const filteredACL = acl.filter(
      (entry) =>
        !(entry.documentId === documentIdToDelete && entry.userId === userIdToDelete)
    );

    localStorage.setItem("acl", JSON.stringify(filteredACL));
    setAcl(filteredACL);

    // حدث إعلام التغيير
    window.dispatchEvent(new Event("data-changed"));
  };

  return (
    <motion.div
      className="space-y-4 bg-white rounded-2xl shadow p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
        <ShieldCheck size={22} /> Role-Based Access Control
      </h3>

      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-red-100 text-red-700 p-2 rounded-md flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertTriangle size={18} /> <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.input
        whileFocus={{ scale: 1.02 }}
        className="border border-gray-300 p-2 rounded w-full"
        placeholder="Document ID"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
      />
      <motion.input
        whileFocus={{ scale: 1.02 }}
        className="border border-gray-300 p-2 rounded w-full"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <motion.select
        whileFocus={{ scale: 1.02 }}
        className="border border-gray-300 p-2 rounded w-full"
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
      >
        <option value="view">View</option>
        <option value="edit">Edit</option>
        <option value="download">Download</option>
      </motion.select>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        onClick={handleAssign}
      >
        Assign Permission
      </motion.button>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-semibold text-gray-800 mb-2">Access List:</h4>
        <ul className="divide-y divide-gray-200">
          {acl.length === 0 && (
            <li className="text-sm text-gray-500">No permissions assigned.</li>
          )}
          <AnimatePresence>
            {acl.map((entry, idx) => (
              <motion.li
                key={idx}
                className="py-2 text-sm text-gray-700 flex justify-between items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <span>
                  📄 <strong>{entry.documentId}</strong> — 👤{" "}
                  <strong>{entry.userId}</strong> →{" "}
                  <span className="text-blue-700 italic">{entry.permission}</span>
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(entry.documentId, entry.userId)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Delete Role"
                  title="Delete Role"
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </motion.div>
  );
}
