import React from "react";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-md z-40 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menu</h2>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-4 space-y-3 text-gray-700 dark:text-gray-300">
        <a href="/chat" className="block hover:text-blue-600 dark:hover:text-blue-400">Chat</a>
        <a href="/profile" className="block hover:text-blue-600 dark:hover:text-blue-400">Profile</a>
      </nav>
    </div>
  );
};

export default Sidebar;
