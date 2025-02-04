// pages/index.js
'use client'
import { useEffect, useState, useRef } from 'react';
import { db } from '@/utils/firebase';
import { ref, onValue, push, serverTimestamp } from "firebase/database";

function HomePage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef(null);

  const sender = localStorage.getItem('sender') || "eve";
  const receiver = localStorage.getItem('recever') || "angel";

  useEffect(() => {
    if (!sender || !receiver) {
      alert("Please set sender and receiver in localStorage.");
      return;
    }

    const messagesRef = ref(db, `messages/${getChatId(sender, receiver)}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [sender, receiver]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const messagesRef = ref(db, `messages/${getChatId(sender, receiver)}`);
      push(messagesRef, {
        sender: sender,
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
      }).then(() => {
        setNewMessage("");
      }).catch((error) => {
        console.error("Error sending message: ", error);
      });
    }
  };

  const getChatId = (user1, user2) => {
    const sortedUsers = [user1, user2].sort();
    return `${sortedUsers[0]}_${sortedUsers[1]}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with {receiver}</h1>

      <div className="message-list h-80 overflow-y-auto border border-gray-300 rounded p-2 mb-4" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === sender ? 'sent' : 'received'} mb-2 p-2 rounded-lg`}>
            <div className="flex justify-between items-center">
              <span className="message-sender font-semibold">{msg.sender}</span>
              <span className="message-timestamp text-sm text-gray-500">{formatTimestamp(msg.timestamp)}</span>
            </div>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="message-input flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          Send
        </button>
      </div>

      <div className="mt-4">
        <p className="text-gray-600">Sender: {sender}</p>
        <p className="text-gray-600">Receiver: {receiver}</p>
      </div>

      <div className="mt-4">
        <input type="text" placeholder="Set Sender" onChange={(e) => localStorage.setItem('sender', e.target.value)} className="border border-gray-300 rounded p-2 mr-2" />
        <input type="text" placeholder="Set Receiver" onChange={(e) => localStorage.setItem('receiver', e.target.value)} className="border border-gray-300 rounded p-2" />
      </div>
    </div>
  );
}

export default HomePage;
