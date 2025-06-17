import { Bot, User } from "lucide-react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-2 max-w-3xl ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="shrink-0">
          {isUser ? (
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="bg-gray-400 text-white p-2 rounded-full">
              <Bot className="w-4 h-4" />
            </div>
          )}
        </div>

        <div
          className={`px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
