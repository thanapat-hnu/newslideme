import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ServiceStatus.css";
import io from "socket.io-client";
import axios from "axios"; // 👈 เพิ่ม axios

const Socket = io("http://localhost:3000");

function ServiceStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [currentStatus, setCurrentStatus] = useState(booking?.status || "");

  const steps = [
    { label: "ยืนยันคำสั่งจอง", value: "รอรับออเดอร์" },
    { label: "กำลังเดินทาง", value: "กำลังจัดส่ง" },
    { label: "สำเร็จ", value: "จัดส่งแล้ว" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.value === currentStatus
  );

  // ✅ ฟังสถานะจาก Driver
  useEffect(() => {
    if (!booking) return;

    Socket.on("statusUpdate", (data) => {
      console.log("📡 ได้รับสถานะใหม่จาก driver:", data);
      setCurrentStatus(data.value);
    });

    return () => {
      Socket.off("statusUpdate");
    };
  }, [booking]);

  // ✅ หากถึงสถานะ "จัดส่งแล้ว" ให้ส่งข้อมูลเข้า history_cus
  useEffect(() => {
    if (currentStatus === "จัดส่งแล้ว") {
      const payload = {
        ...booking,
        status: currentStatus,
        moved_at: new Date().toISOString(), // เวลาเก็บ
      };

      axios.post("http://localhost:3000/api/move-to-history", payload)
        .then(res => {
          console.log("✅ ข้อมูลถูกเก็บลง history_cus แล้ว");
        })
        .catch(err => {
          console.error("❌ เก็บข้อมูลลง history_cus ล้มเหลว:", err);
        });
    }
  }, [currentStatus]);

  if (!booking) {
    return (
      <div className="status-container">
        <h2>⚠️ ไม่พบข้อมูลการจอง</h2>
        <button onClick={() => navigate("/")}>กลับหน้าหลัก</button>
      </div>
    );
  }

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
        <p><strong>รหัสคำสั่งจอง:</strong> {booking.order_id}</p>
        <p><strong>ผู้ให้บริการ:</strong> {booking.providerName}</p>
        <p><strong>ต้นทาง:</strong> lat {booking.origin.lat}, lng {booking.origin.lng}</p>
        <p><strong>ปลายทาง:</strong> lat {booking.destination.lat}, lng {booking.destination.lng}</p>
        <p><strong>ประเภทรถ:</strong> {booking.carType}</p>
        <p><strong>ราคา:</strong> {booking.price} บาท</p>
        <p><strong>เวลาที่จอง:</strong> {new Date(booking.time).toLocaleString("th-TH")}</p>
        <p><strong>สถานะปัจจุบัน:</strong> {currentStatus}</p>
      </div>

      <button className="btn-back" onClick={() => navigate("/home")}>
        กลับหน้าหลัก
      </button>
    </div>
  );
}

export default ServiceStatus;
