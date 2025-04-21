import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

import "./Chat.css";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [data, setData] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // State to store the active chat
  const [message, setMessage] = useState(""); // State for the input field message
  const [messages, setMessages] = useState([]); // State to store messages in the chat
  const [notification, setNotification] = useState(null); // State to store notification data
  const [isNotificationVisible, setIsNotificationVisible] = useState(false); // Track notification visibility

  const notificationSound = new Audio("/livechat-129007.mp3"); // Audio for notification
  const currentUserId = localStorage.getItem("userId") || "guest";
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "notification") {
      // Set the notification from the data (simulated as an example)
      const notificationMessage =
        data.length > 0
          ? `${data[0].providerName} has a new update!`
          : "No new notifications";
      setNotification(notificationMessage);

      // Play notification sound
      notificationSound.play();

      // Show the notification with fade-in animation
      setIsNotificationVisible(true);

      // Set timeout to remove notification after 3 seconds
      setTimeout(() => {
        setIsNotificationVisible(false); // Fade out the notification
        setNotification(null); // Clear notification
        setActiveTab("chat"); // Switch back to the chat tab after notification fades out
      }, 3000);
    } else {
      setNotification(null); // Clear notification when switching back to chat tab
    }
  };

  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        transports: ["websocket"],
      }),
    []
  ); // เชื่อมต่อ socket เพียงครั้งเดียว

  useEffect(() => {
    console.log("Socket connected:", socket.id);

    // Mock data for testing purposes
    setData([
      {
        providerName: "Driver A",
        lastMessage: "Hello!",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    // รับข้อความเฉพาะเมื่อเชื่อมต่อแล้วเท่านั้น
    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("joinRoom", "user123-driver123");
    };

    const handleReceiveMessage = (msg) => {
      console.log("Received message:", msg);
      const isMe = msg.sender === currentUserId;

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.sender === msg.sender &&
            m.text === msg.text &&
            m.timestamp === msg.timestamp
        );
        if (isDuplicate) return prev;
        return [...prev, { ...msg, isMe }];
      });
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect", handleConnect);
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().getTime();
      const newMessage = {
        sender: currentUserId,
        text: message,
        timestamp: timestamp,
      };

      console.log("Sending message:", newMessage);

      if (socket.connected) {
        socket.emit("chatMessage", {
          roomId: "user123-driver123",
          message: newMessage,
        });

        setMessages((prev) => [...prev, { ...newMessage, isMe: true }]); // ตั้ง isMe = true
        setMessage("");
      } else {
        console.error("Socket not connected");
        alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleChatClick = (chatItem) => {
    setActiveChat(chatItem); // Set the active chat when clicked
    setMessages([]); // Clear previous messages
  };

  const closePopup = () => {
    setActiveChat(null); // Close the popup by setting activeChat to null
  };

  if (data === null) {
    console.log("Data is null");
    return <div>Loading...</div>; // แสดงข้อความโหลดจนกว่าจะได้ข้อมูล
  }
  console.log("Data:", data); // Check if data is being loaded

  return (
    <div className="chat-container">
      {/* Title */}
      <div className="chat-title">
        <strong>ข้อความ</strong>
      </div>

      {/* Tab Buttons */}
      <div className="chat-tabs">
        <button
          className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => handleTabClick("chat")}
        >
          แชท
        </button>
        <button
          className={`tab-button ${
            activeTab === "notification" ? "active" : ""
          }`}
          onClick={() => handleTabClick("notification")}
        >
          การแจ้งเตือน
        </button>
      </div>

      {activeTab === "notification" &&
        isNotificationVisible &&
        notification && (
          <div className="notification1-popup show">
            <div className="notification1-header">
              <img
                src="/LOGO_main.png"
                alt="Logo"
                className="notification1-logo"
              />
              <strong>การแจ้งเตือน</strong>
              <button
                className="close-button"
                onClick={() => setNotification(null)}
              >
                X
              </button>
            </div>
            <div className="notification1-body">
              <p>{notification}</p>
            </div>
          </div>
        )}

      {/* Chat Boxes */}
      <div className="chat-list">
        {data.map((chatItem, index) => (
          <div
            key={index}
            className="chat-box"
            onClick={() => handleChatClick(chatItem)}
          >
            <div className="chat-avatar">
              <img
                src="https://www.thaimediafund.or.th/wp-content/uploads/2024/04/blank-profile-picture-973460_1280.png"
                alt="avatar"
                className="avatar-icon"
              />
            </div>
            <div className="chat-details">
              <div className="chat-header">
                <span className="chat-name">{chatItem.providerName}</span>
                <span className="chat-time">{chatItem.time}</span>
              </div>
              <div className="chat-message">{chatItem.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay and Popup Chat Window */}
      {activeChat && (
        <div className="chat-overlay">
          <div className="chat-popup">
            <div className="chat-popup-header">
              <span className="chat-name">{activeChat.providerName}</span>
              <button className="close-button" onClick={closePopup}>
                X
              </button>
            </div>
            <div className="chat-popup-body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.isMe ? "chat-message-you" : "chat-message"}
                >
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-popup-footer">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
