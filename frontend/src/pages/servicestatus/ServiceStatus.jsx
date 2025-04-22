import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ServiceStatus.css';

function ServiceStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="status-container">
        <h2>⚠️ ไม่พบข้อมูลการจอง</h2>
        <button onClick={() => navigate('/')}>กลับหน้าหลัก</button>
      </div>
    );
  }

  return (
    <div className="status-container">
      <h2>📦 สถานะคำสั่งจอง</h2>
      <p><strong>ผู้ให้บริการ:</strong> {booking.providerName}</p>
      <p><strong>ต้นทาง:</strong> lat {booking.origin.lat}, lng {booking.origin.lng}</p>
      <p><strong>ปลายทาง:</strong> lat {booking.destination.lat}, lng {booking.destination.lng}</p>
      <p><strong>ประเภทรถ:</strong> {booking.carType}</p>
      <p><strong>ราคา:</strong> {booking.price} บาท</p>
      <p><strong>เวลาที่จอง:</strong> {new Date(booking.time).toLocaleString('th-TH')}</p>

      <button className="btn-back" onClick={() => navigate('/')}>กลับหน้าหลัก</button>
    </div>
  );
}

export default ServiceStatus;