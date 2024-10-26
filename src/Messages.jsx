import React, { useEffect, useState } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch("http://localhost:5000/api/messages");
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Chat Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <strong>{message.sender}:</strong> {message.content}{" "}
            <em>{new Date(message.timestamp).toLocaleString()}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
