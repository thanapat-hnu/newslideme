import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ServiceStatus.css";
import { useEffect } from "react";
import io from "socket.io-client";

const Socket = io("http://localhost:3000");

function ServiceStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    Socket.on("statusUpdate", (data) => {
      console.log(data);
    })
  }, []);

  if (!booking) {
    return (
      <div className="status-container">
        <h2>⚠️ ไม่พบข้อมูลการจอง</h2>
        <button onClick={() => navigate("/")}>กลับหน้าหลัก</button>
      </div>
    );
  }

  const steps = [
    { label: "ยืนยันคำสั่งจอง", value: "รอรับออเดอร์" },
    { label: "กำลังเดินทาง", value: "กำลังจัดส่ง" },
    { label: "สำเร็จ", value: "จัดส่งแล้ว" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.value === booking.status
  );

  return (
    <div className="status-container">
      <h2>📦 สถานะคำสั่งจอง</h2>

      <div className="step-progress">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="step-item">
              <div className={`circle ${index <= currentStepIndex ? "active" : ""}`}>
                {index <= currentStepIndex ? "✓" : ""}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`line ${index < currentStepIndex ? "active" : ""}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="booking-details">
        <p><strong>ผู้ให้บริการ:</strong> {booking.providerName}</p>
        <p><strong>ต้นทาง:</strong> lat {booking.origin.lat}, lng {booking.origin.lng}</p>
        <p><strong>ปลายทาง:</strong> lat {booking.destination.lat}, lng {booking.destination.lng}</p>
        <p><strong>ประเภทรถ:</strong> {booking.carType}</p>
        <p><strong>ราคา:</strong> {booking.price} บาท</p>
        <p><strong>เวลาที่จอง:</strong> {new Date(booking.time).toLocaleString("th-TH")}</p>
        <p><strong>สถานะปัจจุบัน:</strong> {booking.status}</p>
      </div>

      <button className="btn-back" onClick={() => navigate("/home")}>
        กลับหน้าหลัก
      </button>
    </div>
  );
}

export default ServiceStatus;
