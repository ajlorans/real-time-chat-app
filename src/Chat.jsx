import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css"; // Import the CSS file

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState({ content: "", sender: "" });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/messages");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("updateMessage", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socket.on("addReaction", (reactionData) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg._id === reactionData.messageId) {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                { user: reactionData.user, reaction: reactionData.reaction },
              ],
            };
          }
          return msg;
        })
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateMessage");
      socket.off("addReaction");
    };
  }, []);

  const sendMessage = () => {
    if (input.content && input.sender) {
      const messageData = {
        content: input.content,
        sender: input.sender,
        reactions: [],
      };
      socket.emit("sendMessage", messageData);
      setInput({ content: "", sender: "" });
    }
  };

  const addReaction = (messageId, reaction) => {
    const user = input.sender; // Get the username from input
    socket.emit("addReaction", { messageId, reaction, user });
  };

  return (
    <div className="chat-container">
      <div>
        {messages.map((message) => (
          <div key={message._id} className="message">
            <strong>{message.sender}: </strong>
            {message.content}
            <div>
              <small>{new Date(message.createdAt).toLocaleString()}</small>{" "}
              {/* Display the date */}
            </div>
            <div>
              <button onClick={() => addReaction(message._id, "👍")}>👍</button>
              <button onClick={() => addReaction(message._id, "❤️")}>❤️</button>
              <button onClick={() => addReaction(message._id, "😂")}>😂</button>
            </div>
            {message.reactions &&
              message.reactions.map((reaction, index) => (
                <span key={index}>
                  {reaction.user} reacted with {reaction.reaction}
                </span>
              ))}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Your name"
          value={input.sender}
          onChange={(e) => setInput({ ...input, sender: e.target.value })}
        />
        <input
          type="text"
          placeholder="Message"
          value={input.content}
          onChange={(e) => setInput({ ...input, content: e.target.value })}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
