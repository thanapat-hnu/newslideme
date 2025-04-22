import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './driverchat.module.css';

const DriverChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [lastMessageId, setLastMessageId] = useState(0);
  const messagesEndRef = useRef(null);

  // Get driver name from localStorage
  const driverName = localStorage.getItem('driverName') || 'Sender2';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch messages every 1 second
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/chat/messages', {
          params: { lastId: lastMessageId }
        });

        if (response.data.success && response.data.messages.length > 0) {
          setMessages(prev => [...prev, ...response.data.messages]);
          setLastMessageId(response.data.messages[response.data.messages.length - 1].id);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const intervalId = setInterval(fetchMessages, 1000);
    return () => clearInterval(intervalId);
  }, [lastMessageId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post('http://localhost:3000/api/chat/messages', {
        message: newMessage,
        sender: driverName
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <button onClick={() => navigate('/driver/main')} className={styles.backButton}>
          กลับ
        </button>
        <h2>แชท ({driverName})</h2>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === driverName ? styles.sent : styles.received
            }`}
          >
            <div className={styles.messageContent}>
              <span className={styles.sender}>{msg.sender}</span>
              <p>{msg.message}</p>
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>
          ส่ง
        </button>
      </form>
    </div>
  );
};

export default DriverChat;