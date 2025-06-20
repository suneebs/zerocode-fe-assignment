import React from "react";
import { X, Trash2, Download, PlusCircleIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useChatStorage } from "../hooks/useChatStorage";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { clearChat, exportChat } = useChatStorage(user?.uid, () => {});
  const sessions =[]

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

      <nav className="p-4 space-y-4 text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
        <button
          className="w-full flex items-center gap-2 px-4 py-2 text-green-800 dark:text-blugreen-200"
        >
          <PlusCircleIcon className="w-4 h-4" />
          New Chat
        </button>
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Chat History
          </h3>
          
        </div>

        <ul className="space-y-1 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
          {sessions.length === 0 ? (
            <li className="text-sm text-gray-400 italic">No previous chats</li>
          ) : (
            sessions.map((session) => (
              <li
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className="cursor-pointer px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-gray-800 dark:text-gray-200"
              >
                {session.title || "Untitled Chat"}
              </li>
            ))
          )}
        </ul>
      </div>


    </div>
  );
};

export default Sidebar;
