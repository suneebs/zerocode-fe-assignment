// src/hooks/useChatStorage.js
import { useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export const useChatStorage = (userId, setMessages) => {
  useEffect(() => {
    if (!userId) return;

    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        role: doc.data().role,
        text: doc.data().text,
      }));
      setMessages(chats);
    });

    return () => unsubscribe();
  }, [userId, setMessages]);

  const saveMessage = async (role, text) => {
    if (!userId || !text.trim()) return;

    try {
      await addDoc(collection(db, "chats", userId, "messages"), {
        role,
        text,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to save message:", error.message);
    }
  };

  const clearChat = async () => {
    if (!userId) return;

    const chatRef = collection(db, "chats", userId, "messages");
    const snapshot = await getDocs(chatRef);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  };

  const exportChat = async () => {
    const chatRef = collection(db, "chats", userId, "messages");
    const snapshot = await getDocs(chatRef);
    const chatText = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return `${data.role.toUpperCase()}: ${data.text}`;
      })
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zerocode-chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return { saveMessage, clearChat, exportChat };
};
