// LoadingIndicator.jsx
import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Loader2 className="animate-spin" size={16} />
      <span>Loading...</span>
    </div>
  );
}