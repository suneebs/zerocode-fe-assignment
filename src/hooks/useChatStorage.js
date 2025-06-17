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

  return { saveMessage };
};
