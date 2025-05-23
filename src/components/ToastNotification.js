// ToastNotification.jsx
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function ToastNotification({ message, type = "success", onClose }) {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const Icon = type === "success" ? <CheckCircle /> : <AlertTriangle />;

  return (
    <div className={`${bgColor} ${textColor} p-3 rounded-md flex items-center justify-between mb-2 shadow-lg animate-fade-in`}>
      <div className="flex items-center gap-2">
        {Icon}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="text-sm font-bold">&times;</button>
    </div>
  );
}