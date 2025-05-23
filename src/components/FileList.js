import React, { useEffect, useState } from "react";
import { FileText, FolderOpen, Trash2 } from "lucide-react";

function FileList() {
  const [files, setFiles] = useState([]);
  const [acl, setAcl] = useState([]);  // هنا نضيف state للأدوار

  const loadFiles = () => {
    const stored = JSON.parse(localStorage.getItem("files") || "[]");
    setFiles(stored);
  };

  const loadAcl = () => {
    const storedAcl = JSON.parse(localStorage.getItem("acl") || "[]");
    setAcl(storedAcl);
  };

  const handleDelete = (id) => {
    const updated = files.filter((f) => f.id !== id);
    localStorage.setItem("files", JSON.stringify(updated));
    setFiles(updated);

    // نحدث الأدوار المرتبطة بالملف المحذوف (لو عايز تمسحهم كمان)
    const updatedAcl = acl.filter((entry) => entry.documentId !== id);
    localStorage.setItem("acl", JSON.stringify(updatedAcl));
    setAcl(updatedAcl);
  };

  useEffect(() => {
    loadFiles();
    loadAcl();

    const handleStorageChange = () => {
      loadFiles();
      loadAcl();
    };

    const handleFileAdded = () => {
      loadFiles();
      loadAcl();
    };

     const handleDataChanged = () => {
      loadFiles();
      loadAcl();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("file-added", handleFileAdded);
     window.addEventListener("data-changed", handleDataChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("file-added", handleFileAdded);
         window.removeEventListener("data-changed", handleDataChanged);
    };
  }, []);

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
        <FolderOpen size={22} /> Uploaded Files
      </h3>

      {files.length === 0 ? (
        <p className="text-gray-500 italic">No files uploaded yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((f) => {
            // نجيب كل الأدوار المرتبطة بالملف الحالي من acl
            const rolesForFile = acl.filter((entry) => entry.documentId === f.id);

            return (
              <li
                key={f.id}
                className="border border-gray-200 shadow-sm rounded-md p-4 bg-white hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <strong>TITLE :</strong> <FileText size={18} /> {f.title}

                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  <strong>NAME :</strong> ({f.name})
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Description:</strong> {f.description || "—"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>ID:</strong>{" "}
                  <code className="bg-gray-100 px-1 rounded">{f.id}</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {f.type}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tags:</strong>{" "}
                  {f.tags && f.tags.length > 0 ? f.tags.join(", ") : "—"}
                </p>

                {/* هنا نعرض قائمة الأدوار والصلاحيات المرتبطة بالملف */}
                <div className="mt-3">
                  <strong className="text-gray-800">Access Roles:</strong>
                  {rolesForFile.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No roles assigned.</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                      {rolesForFile.map(({ userId, permission }, idx) => (
                        <li key={idx}>
                          User: <span className="font-semibold">{userId}</span> — Role:{" "}
 <span
  className={`italic font-medium ${
    permission.toLowerCase() === "edit"
      ? "text-yellow-700"
      : permission.toLowerCase() === "download"
      ? "text-green-700"
      : permission.toLowerCase() === "view"
      ? "text-blue-700"
      : "text-gray-500"
  }`}
>
  {permission}
</span>


                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FileList;
