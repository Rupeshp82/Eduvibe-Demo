"use client";
// pages/friends/[id].js
import Body from "@/components/Body";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

let socket;

export default function Home({ params }) {
  const { id } = params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("Anonymous");
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (session) {
      setUserName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (id) {
      // Fetch message history on initial load with error handling
      fetch(`/api/friends/${id}`)
        .then((res) => res.json())
        .then((data) => setMessages(JSON.parse(data)))
        .catch((error) =>
          console.error("Error fetching message history:", error)
        );
      socketInitializer();
    }
  }, [id]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
      setIsConnected(true); // Set connected state
      socket.emit("joinRoom", id); // Join the room
    });

    // Handle incoming messages and update state
    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      // Ensure msg is an object
      if (typeof msg === 'object' && msg !== null && 'message' in msg && 'participant' in msg && 'date' in msg) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      } else {
        console.warn("Received invalid message format:", msg);
      }
    });

    // Error handling for socket disconnection (optional)
    socket.on("disconnect", (reason) => {
      console.error("Socket disconnected:", reason);
      setIsConnected(false); // Update connection state (optional)
      // Implement reconnection logic or display an error message (optional)
    });
  };

  const sendMessage = () => {
    if (message.trim() !== "" && isConnected) {
      try {
        const newMessage = {
          roomId: id,
          message,
          participant: userName,
          date: new Date().toISOString(),
        };
        console.log("Sending message:", newMessage);
        socket.emit("event:message", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.warn("Message not sent. Either it's empty or socket is not connected.");
    }
  };

  console.log(messages);

  return (
    <Body>
      <h1>Chat Room: {id}</h1>
      <div className="p-4 border border-gray-300 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col border-b border-gray-300">
            <div className="flex justify-between">
              <p>{msg.participant}</p>
              <p>{new Date(msg.date).toLocaleString()}</p>
            </div>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      {isConnected && ( // Render input only if connected
        <div className="chat-input">
          <input
            className="p-2 border border-gray-300 rounded"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      )}
    </Body>
  );
}
