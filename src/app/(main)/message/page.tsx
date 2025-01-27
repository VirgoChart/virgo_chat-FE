import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MessageInput from "./MessageInput";

interface ChatProps {
  roomId: string;
}

const Chat = ({ roomId }: ChatProps) => {
  const [messages, setMessages] = useState([]);
  const socket = io("http://localhost:2808");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            <strong>{msg.sender.fullName}</strong>: {msg.text || "File Sent"}
            {msg.file && (
              <a
                href={msg.file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {msg.file.fileName}
              </a>
            )}
          </div>
        ))}
      </div>
      <MessageInput
        roomId={roomId}
        onMessageSent={(newMessage) =>
          setMessages((prev) => [...prev, newMessage])
        }
      />
    </div>
  );
};

export default Chat;
