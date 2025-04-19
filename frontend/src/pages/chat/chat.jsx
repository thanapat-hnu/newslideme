import React, { useState, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
    const [activeTab, setActiveTab] = useState('chat');
    const [data, setData] = useState(null);
    const [activeChat, setActiveChat] = useState(null); // State to store the active chat
    const [message, setMessage] = useState(''); // State for the input field message
    const [messages, setMessages] = useState([]); // State to store messages in the chat
    const [notification, setNotification] = useState(null); // State to store notification data
    const [isNotificationVisible, setIsNotificationVisible] = useState(false); // Track notification visibility

    const notificationSound = new Audio('public/livechat-129007.mp3'); // Audio for notification

    const handleTabClick = (tab) => {
        setActiveTab(tab);

        if (tab === 'notification') {
            // Set the notification from the data (simulated as an example)
            const notificationMessage = data.length > 0 ? `${data[0].providerName} has a new update!` : "No new notifications";
            setNotification(notificationMessage);

            // Play notification sound
            notificationSound.play();

            // Show the notification with fade-in animation
            setIsNotificationVisible(true);

            // Set timeout to remove notification after 3 seconds
            setTimeout(() => {
                setIsNotificationVisible(false); // Fade out the notification
                setNotification(null); // Clear notification
                setActiveTab('chat'); // Switch back to the chat tab after notification fades out
            }, 3000);
        } else {
            setNotification(null); // Clear notification when switching back to chat tab
        }
    };

    useEffect(() => {
        fetch('/data.json') // Fetch data from public/data.json
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error('Error loading JSON:', error));
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            // Update the messages in the chat
            const newMessage = { sender: 'You', text: message };
            setMessages([...messages, newMessage]);

            // Format the time to display without seconds
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Update the data object with the latest message and time
            const updatedData = data.map((chatItem) => {
                if (chatItem.providerName === activeChat.providerName) {
                    return {
                        ...chatItem,
                        lastMessage: message,
                        time: currentTime
                    };
                }
                return chatItem;
            });

            setData(updatedData); // Update data to reflect the latest message in the chat list

            setMessage(''); // Clear input after sending
        }
    };

    const handleChatClick = (chatItem) => {
        setActiveChat(chatItem); // Set the active chat when clicked
        setMessages([]); // Clear previous messages
    };

    const closePopup = () => {
        setActiveChat(null); // Close the popup by setting activeChat to null
    };

    if (!data) {
        return <div>Loading...</div>; // Display a loading message while fetching data
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
                    className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => handleTabClick('chat')}
                >
                    แชท
                </button>
                <button
                    className={`tab-button ${activeTab === 'notification' ? 'active' : ''}`}
                    onClick={() => handleTabClick('notification')}
                >
                    การแจ้งเตือน
                </button>
            </div>

            {activeTab === 'notification' && isNotificationVisible && notification && (
                <div className="notification1-popup show">
                    <div className="notification1-header">
                        <img src="public/LOGO_main.png" alt="Logo" className="notification1-logo" />
                        <strong>การแจ้งเตือน</strong>
                        <button className="close-button" onClick={() => setNotification(null)}>X</button>
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
                            <img src='https://www.thaimediafund.or.th/wp-content/uploads/2024/04/blank-profile-picture-973460_1280.png' alt="avatar" className="avatar-icon" />
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
                            <button className="close-button" onClick={closePopup}>X</button>
                        </div>
                        <div className="chat-popup-body">
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.sender === 'You' ? 'chat-message-you' : 'chat-message'}>
                                    {/* Display time before the sender */}
                                    <span className="message-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
