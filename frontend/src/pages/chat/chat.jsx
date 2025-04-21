const generateRoomId = (userId, driverId) => {
  return [userId, driverId].sort().join("-");
};

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const [isTyping, setIsTyping] = useState(false); // Track if someone is typing
  const [typingUser, setTypingUser] = useState(""); // Track who is typing
  const [roomId, setRoomId] = useState(""); // Store current roomId

  const typingTimeoutRef = useRef(null); // Ref for typing timeout
  const messagesEndRef = useRef(null);
  const notificationSound = new Audio("/livechat-129007.mp3"); // Audio for notification
  const currentUserId = localStorage.getItem("userId") || "guest";

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "notification") {
      // Set the notification from the data (simulated as an example)
      const notificationMessage =
        data?.length > 0
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
  );

  useEffect(() => {
    console.log("Socket connected:", socket.id);

    // Mock data for testing purposes
    setData([
      {
        id: "driver123",
        providerName: "Driver A",
        lastMessage: "Hello!",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      
      if (roomId) {
        socket.emit("joinRoom", roomId);
      }
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
        
        // Save messages to localStorage for persistence
        const updatedMessages = [...prev, { ...msg, isMe }];
        if (roomId) {
          localStorage.setItem(`chat_${roomId}`, JSON.stringify(updatedMessages));
        }
        
        return updatedMessages;
      });
      
      // Clear typing indicator when message is received
      if (!isMe) {
        setIsTyping(false);
      }
    };
    
    const handleTyping = ({ user }) => {
      if (user !== currentUserId) {
        setIsTyping(true);
        setTypingUser(user);
      }
    };
    
    const handleStopTyping = ({ user }) => {
      if (user !== currentUserId) {
        setIsTyping(false);
        setTypingUser("");
      }
    };
    
    const handleMessageHistory = ({ messages: historyMessages }) => {
      if (historyMessages && historyMessages.length > 0) {
        const formattedMessages = historyMessages.map(msg => ({
          ...msg,
          isMe: msg.sender === currentUserId
        }));
        setMessages(formattedMessages);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);
    socket.on("messageHistory", handleMessageHistory);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect", handleConnect);
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
      socket.off("messageHistory", handleMessageHistory);
    };
  }, [socket, currentUserId, roomId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().getTime();
      const newMessage = {
        sender: currentUserId,
        text: message,
        timestamp: timestamp,
      };

      console.log("Sending message:", newMessage);

      if (socket.connected && roomId) {
        socket.emit("chatMessage", {
          roomId: roomId,
          message: newMessage,
        });
        
        // Emit stop typing when sending message
        socket.emit("stopTyping", { roomId, user: currentUserId });
        
        // Clear the typing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        setMessage("");
      } else {
        console.error("Socket not connected or roomId missing");
        alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleChatClick = (chatItem) => {
    setActiveChat(chatItem); // Set the active chat when clicked
    
    // Create a room ID using user and driver IDs
    const newRoomId = generateRoomId(currentUserId, chatItem.id);
    setRoomId(newRoomId);
    
    // Join the room
    socket.emit("joinRoom", newRoomId);
    
    // Try to load messages from localStorage first
    const savedMessages = localStorage.getItem(`chat_${newRoomId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]); // Clear previous messages if no saved ones
      
      // Request message history from server
      socket.emit("getMessageHistory", { roomId: newRoomId });
    }
  };
  
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Only emit typing events if there's an active chat
    if (roomId) {
      // Send typing event
      socket.emit("typing", { roomId, user: currentUserId });
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { roomId, user: currentUserId });
      }, 2000);
    }
  };

  const closePopup = () => {
    setActiveChat(null); // Close the popup by setting activeChat to null
    setRoomId(""); // Clear the room ID
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="typing-indicator">
                  <span>{typingUser || "Someone"} is typing</span>
                  <span className="dots">
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-popup-footer">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="chat-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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