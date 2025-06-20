import { useEffect, useRef, useState } from "react";
import ChatMessage from "../components/ChatMessage";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Bot, Send, Mic, MicOff } from "lucide-react";
import { useChatStorage } from "../hooks/useChatStorage";

export default function ChatPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  const [messages, setMessages] = useState([]);
  const { saveMessage } = useChatStorage(user?.uid, setMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);

  const endRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup speech recognition on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setHistory((prev) => [...prev, input]);
    saveMessage("user", input);
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
      saveMessage("assistant", botReply);
    } catch (err) {
      console.error("Error:", err.message);
      const errorMsg = "Error contacting OpenRouter API.";
      setMessages((prev) => [...prev, { role: "assistant", text: errorMsg }]);
      saveMessage("assistant", errorMsg);
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

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              {[
                {
                  label: "Learn React Hooks",
                  text: "Learn React Hooks\nGet explanations with practical examples",
                  desc: "Explain how React hooks work with examples",
                },
                {
                  label: "Debug Code",
                  text: "Debug Code\nGet help fixing programming issues",
                  desc: "Help me debug this JavaScript error: [paste your error here]",
                },
                {
                  label: "Learning Path",
                  text: "Learning Path\nGet personalized study recommendations",
                  desc: "Create a learning plan for becoming a full-stack developer",
                },
                {
                  label: "Code Review",
                  text: "Code Review\nGet feedback on your code quality",
                  desc: "Review this code and suggest improvements: [paste your code here]",
                },
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(prompt.desc)}
                  className="text-left px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition"
                >
                  <span className="font-medium">{prompt.label}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {prompt.text.split("\n")[1]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                <span>Bot is typing...</span>
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
            placeholder="Type your message or speak..."
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-lg transition ${
              isListening
                ? "bg-red-600 text-white animate-pulse"
                : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
