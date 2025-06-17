export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`px-4 py-2 rounded-lg ${isUser ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-900"}`}>
        {message.text}
      </div>
    </div>
  );
}
