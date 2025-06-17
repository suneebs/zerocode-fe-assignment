import { useEffect, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Bot } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setHistory((prev) => [...prev, input]);
    setInput("");
    setHistoryIndex(-1);
    setLoading(true);

    const payload = {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful chatbot assistant." },
        ...messages.map((m) => ({ role: m.role, content: m.text })),
        { role: "user", content: input },
      ],
    };

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "ZeroCode Chatbot",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`OpenRouter error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const botReply =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { role: "assistant", text: botReply }]);
    } catch (err) {
      console.error("Error:", err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error contacting OpenRouter API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      if (history.length && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setInput(history[history.length - 1 - newIndex]);
        setHistoryIndex(newIndex);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setInput(history[history.length - 1 - newIndex]);
        setHistoryIndex(newIndex);
      } else {
        setInput("");
        setHistoryIndex(-1);
      }
    }
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="pt-16 min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex-1 overflow-y-auto px-4 pb-36 pt-6 relative">
        {showWelcome ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot className="h-14 w-14 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
              Welcome to ZeroCode Chat!
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
              Start a conversation with our AI assistant. Try asking questions,
              getting help with code, or exploring creative ideas.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {loading && (
              <div className="text-sm italic text-gray-500 dark:text-gray-400">
                Bot is typing...
              </div>
            )}
            <div ref={endRef} />
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 z-10 p-3 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"
      >
        <div className="mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
