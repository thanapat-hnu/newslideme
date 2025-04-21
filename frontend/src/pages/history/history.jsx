import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './history.css';

const History = () => {
    const [showSection, setShowSection] = useState(true);
    const [historyData, setHistoryData] = useState([]); // เก็บข้อมูล history
    const [isPopupOpen, setIsPopupOpen] = useState(false); // ควบคุมการแสดงผล Popup
    const [ratingItem, setRatingItem] = useState(null); // เก็บข้อมูลของรายการที่กำลังให้คะแนน
    const [rating, setRating] = useState(0); // เก็บคะแนนที่ผู้ใช้เลือก
    const navigate = useNavigate();

    useEffect(() => {
        const personalId = localStorage.getItem('userId');
        
        if (personalId) {
            fetch(`http://localhost:3000/api/get-history/${personalId}`)
                .then((response) => response.json())
                .then((result) => {
                    if (result.success) {
                        setHistoryData(result.data);
                    }
                })
                .catch((error) => console.error('Error loading history:', error));
        }
    }, []);

    useEffect(() => {
        // ระบุ historyId ที่ต้องการ
        const historyId = 1;
        
        fetch(`http://localhost:3000/api/history/${historyId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    // แปลงข้อมูลเดี่ยวให้เป็น array เพื่อใช้กับ map
                    setHistoryData([result.data]);
                } else {
                    console.error("Error loading history:", result.message);
                }
            })
            .catch((error) => console.error('Error loading history:', error));
    }, []);

    const handleBackClick = () => {
        setShowSection(false); // ซ่อน section เมื่อกดปุ่ม
        setTimeout(() => {
            navigate('/list');
        }, 500); // ตั้งเวลาให้เหมือนกับระยะเวลา transition
    };

    const handleRateClick = (item) => {
        setRatingItem(item); // เก็บรายการที่เลือกไว้ใน state
        setIsPopupOpen(true); // เปิด Popup
    };

    const handleClosePopup = () => {
        // อัปเดตข้อมูลให้รายการนั้นๆมีการให้คะแนนแล้ว
        const updatedHistoryData = historyData.map((item) =>
            item.providerId === ratingItem.providerId
                ? { ...item, hasRated: true } // ตั้งค่า hasRated เป็น true
                : item
        );
        setHistoryData(updatedHistoryData);
        setIsPopupOpen(false); // ปิด Popup
        setRatingItem(null); // ล้างรายการที่เลือก
    };

    const handleStarClick = (starIndex) => {
        setRating(starIndex); // เมื่อคลิกดาว, ให้คะแนนตามดัชนี
    };

    return (
        <div className="history-container">
            <button onClick={handleBackClick} className="back-btn1">
                <FaArrowLeft />
            </button>

            {historyData.map((item) => (
                <section key={item.providerId} className={`latest-section ${showSection ? 'slide-in' : 'slide-out'}`}>
                    <div className="card">
                        <div className="card-row">
                            <div className="card-icon green-bg">
                                <i className="bi bi-truck"></i>
                            </div>
                            <div className="card-info">
                                <p className="card-date">{item.randomDateTime}</p>
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.providerName}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="bi bi-geo-alt-fill red" style={{ fontSize: '14px' }}></i>
                                    <p>ต้นทาง: {item.locations.origin.address}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="bi bi-geo-alt-fill green" style={{ fontSize: '14px' }}></i>
                                    <p>ปลายทาง: {item.locations.destination.address}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <i className="bi bi-car-front" style={{ fontSize: '14px' }}></i>
                                    <p>ประเภท: {item.towTruckType}</p>
                                </div>

                                <p className="card-status green-text">ดำเนินการเสร็จสิ้น</p>
                                <div className="card-actions">
                                    {/* ปรับปุ่มให้คะแนน */}
                                    {!item.hasRated ? (
                                        <button onClick={() => handleRateClick(item)}>ให้คะแนน</button>
                                    ) : (
                                        <p>ให้คะแนนแล้ว</p>
                                    )}
                                </div>
                            </div>
                            <div className="card-price">฿ {item.price}</div>
                        </div>
                    </div>
                </section>
            ))}

            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="pcontent">
                        {/* โลโก้ที่ตรงกลาง */}
                        <div className="popup-logo">
                            <img src="public/LOGO_main.png" alt="Logo" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <h3>{ratingItem?.providerName}</h3>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((starIndex) => (
                                <i
                                    key={starIndex}
                                    className={`bi bi-star${starIndex <= rating ? '-fill' : ''}`} // เปลี่ยนเป็นดาวเต็มหรือโปร่ง
                                    style={{
                                        fontSize: '24px',
                                        color: starIndex <= rating ? 'gold' : 'gold', // สีของดาว
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleStarClick(starIndex)} // ให้ผู้ใช้คลิกเพื่อให้คะแนน
                                ></i>
                            ))}
                        </div>
                        <button className="confirm-btn" onClick={handleClosePopup}>
                            ยืนยัน
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
