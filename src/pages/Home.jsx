import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPage from "./ChatPage";
import Header from "../components/Header";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Toggle function for both open and close
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Main content that shifts */}
      <div
        className={`flex-1 flex flex-col transform transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header onMenuClick={toggleSidebar} /> {/* Pass toggle here */}
        <main className="flex-1 overflow-auto mt-16">
          <ChatPage />
        </main>
      </div>
    </div>
  );
}
