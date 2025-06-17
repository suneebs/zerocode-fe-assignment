import React, { useEffect, useState, useRef } from "react";
import { Menu, Moon, Sun, Bot, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
      {/* Left: Menu and App Title */}
      <div className="flex items-center space-x-3">
        <Menu
          className="h-5 w-5 text-gray-800 dark:text-white cursor-pointer"
          onClick={onMenuClick}
        />
        <Bot className="h-5 w-5 text-blue-600" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          ZeroCode Chatbot
        </span>
      </div>

      {/* Right: Theme toggle + Avatar + Dropdown */}
      <div className="relative flex items-center space-x-4" ref={dropdownRef}>
        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-400"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <img
          src={getAvatar()}
          alt="User Avatar"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="h-8 w-8 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-blue-500 transition"
        />

        {dropdownOpen && (
          <div className="absolute right-0 top-12 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
