import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Chat.css";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [data, setData] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(0);

  // ดึงข้อมูลผู้ใช้จาก localStorage
  const userType = localStorage.getItem("customerType") || "guest";
  const userName = localStorage.getItem("customerName") || "guest";
  const userPhone = localStorage.getItem("customerPhone") || "";

  // แก้ไขฟังก์ชัน loadNewMessages
  const loadNewMessages = async () => {
    try {
      // เปลี่ยนเป็นดึงข้อความทั้งหมด
      const response = await axios.get('http://localhost:3000/api/chat/messages');
      
      if (response.data.success) {
        const allMessages = response.data.messages.map(msg => ({
          ...msg,
          isMe: msg.sender === userName,
          text: msg.message
        }));
        
        setMessages(allMessages);
        if (allMessages.length > 0) {
          setLastMessageId(allMessages[allMessages.length - 1].id);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // แก้ไข useEffect สำหรับการโหลดข้อความครั้งแรก
  useEffect(() => {
    // โหลดข้อความครั้งแรก
    loadNewMessages();

    // สร้าง mock data สำหรับรายการแชท
    const mockData = [{
      providerName: userType === "customer" ? "คนขับ" : "ลูกค้า",
      lastMessage: "คลิกเพื่อเริ่มแชท",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }];
    
    // กำหนดค่า data
    setData(mockData);

    // ตั้งค่า interval สำหรับการอัพเดทข้อความ
    const intervalId = setInterval(loadNewMessages, 1000);

    // Cleanup interval เมื่อ component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const response = await axios.post('http://localhost:3000/api/chat/messages', {
          message: message.trim(),
          sender: userName
        });

        if (response.data.success) {
          const newMessage = {
            ...response.data.message,
            isMe: true,
            text: response.data.message.message
          };
          setMessages(prev => [...prev, newMessage]);
          setMessage("");
          setLastMessageId(response.data.message.id);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleChatClick = (chatItem) => {
    setActiveChat(chatItem);
    loadNewMessages(); // โหลดข้อความเมื่อเปิดแชท
  };

  const closePopup = () => {
    setActiveChat(null);
  };

  // แก้ไขเงื่อนไขการแสดงผล Loading
  if (!data || data.length === 0) {
    return <div className="loading">กำลังโหลด...</div>;
  }

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
          className={`tab-button ${activeTab === "notification" ? "active" : ""}`}
          onClick={() => handleTabClick("notification")}
        >
          การแจ้งเตือน
        </button>
      </div>

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
