import React, { useState } from 'react';
import './Notification.css';

const notifications = [
  "ค้นพบ <strong>ไรเดอร์</strong> ที่ให้บริการแล้ว !!",
  "<strong>ไรเดอร์</strong> อยู่ในระหว่างการเดินทาง !",
  "<strong>ไรเดอร์</strong> ใกล้ถึงที่หมายของคุณแล้ว !",
  "<strong>ไรเดอร์</strong> ได้มาถึงที่หมายแล้ว !!"
];

const NotificationApp = () => {
  const [currentNotification, setCurrentNotification] = useState(null);

  const triggerNotification = (index) => {
    setCurrentNotification(index);

    const audio = new Audio('public/livechat-129007.mp3');
    audio.play().catch((error) => {
      console.error("เสียงไม่สามารถเล่นได้:", error);
    });

    setTimeout(() => {
      setCurrentNotification(null);
    }, 3000);
  };

  return (
    <div className="app-container">
      <div className="button-container">
        <button onClick={() => triggerNotification(2)}>แจ้งเตือน 1</button>
      </div>

      {currentNotification !== null && (
        <div className="notification-popup">
          <img src="public/LOGO_main.png" alt="Logo" className="logo" />
          <p dangerouslySetInnerHTML={{ __html: notifications[currentNotification] }}></p>
        </div>
      )}
    </div>
  );
};

export default NotificationApp;