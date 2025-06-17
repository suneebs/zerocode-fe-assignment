import React from "react";
import { X, Trash2, Download } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useChatStorage } from "../hooks/useChatStorage";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { clearChat, exportChat } = useChatStorage(user?.uid, () => {});

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-md z-40 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Menu
        </h2>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-4 space-y-4 text-gray-700 dark:text-gray-300">
        <button
          onClick={clearChat}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-800 dark:text-red-200"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
        <button
          onClick={exportChat}
          className="w-full flex items-center gap-2 px-4 py-2 text-blue-800 dark:text-blue-200"
        >
          <Download className="w-4 h-4" />
          Export Chat
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
