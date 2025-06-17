import React, { useEffect, useState } from "react";
import { Menu, Moon, Sun, Bot } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar"; 

export default function Header({ onMenuClick }) {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const { user } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const getAvatar = () => {
    if (user?.photoURL) return user.photoURL;
    if (user?.email) {
      const initials = user.email[0].toUpperCase();
      return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;
    }
    return "https://ui-avatars.com/api/?name=ZC&background=0D8ABC&color=fff";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
      {/* Left: Menu and App Title */}
      <div className="flex items-center space-x-3">
        <Menu
          className="h-5 w-5 text-gray-800 dark:text-white cursor-pointer"
          onClick={onMenuClick} // ✅ controlled by parent
        />
        <Bot className="h-5 w-5 text-blue-600" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          ZeroCode Chatbot
        </span>
      </div>

      {/* Right: Theme toggle + Avatar */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-400"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <img
          src={getAvatar()}
          alt="User Avatar"
          className="h-8 w-8 rounded-full object-cover cursor-pointer"
        />
      </div>
    </header>
  );
}
