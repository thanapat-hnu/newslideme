import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ServiceStatus.css";
import io from "socket.io-client";
import axios from "axios";

const Socket = io("http://localhost:3000");

const fetchLocationName = async (lat, lng) => {
  try {
    const response = await axios.get("http://localhost:3000/api/reverse-geocode", {
      params: { lat, lon: lng },
    });
    return response.data.name || "ไม่ทราบพื้นที่";
  } catch (error) {
    console.error("❌ Error fetching location name:", error);
    return "ไม่ทราบพื้นที่";
  }
};

function ServiceStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [currentStatus, setCurrentStatus] = useState(booking?.status || "");
  const [personalId, setPersonalId] = useState(null); // ✅ เก็บ personal_id
  const [originName, setOriginName] = useState("กำลังโหลด...");
  const [destinationName, setDestinationName] = useState("กำลังโหลด...");

  const steps = [
    { label: "ยืนยันคำสั่งจอง", value: "รอรับออเดอร์" },
    { label: "กำลังเดินทาง", value: "กำลังจัดส่ง" },
    { label: "รอการชำระเงิน", value: "รอชำระเงิน" },
    { label: "สำเร็จ", value: "จัดส่งแล้ว" },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.value === currentStatus
  );

  useEffect(() => {
    if (!booking) return;

    // ✅ รับสถานะจาก driver
    Socket.on("statusUpdate", (data) => {
      console.log("📡 ได้รับสถานะใหม่จาก driver:", data);
      setCurrentStatus(data.value);
    });

    // ✅ รับ personal_id จาก driver
    Socket.on("idPersonal", (id) => {
      console.log("📌 ได้รับ personal_id:", id);
      setPersonalId(id);
    });

    return () => {
      Socket.off("statusUpdate");
      Socket.off("idPersonal");
    };
  }, [booking]);

  // ✅ ส่งข้อมูลเข้า history_cus เมื่อถึง "จัดส่งแล้ว"
  useEffect(() => {
    if (currentStatus === "จัดส่งแล้ว") {
      const payload = {
        ...booking,
        personal_id: personalId,
        status: currentStatus,
        moved_at: new Date().toISOString(),
      };

      console.log("✅ ข้อมูลที่จะเก็บลง history_cus:", payload);

      axios
        .post("http://localhost:3000/api/move-to-history", {
          order_id: payload.order_id,
          personal_id: payload.personal_id || null,
          order_datetime: payload.time || null,
          shop_name: payload.providerName || null,
          origin: `lat:${payload.origin.lat},lng:${payload.origin.lng}` || null,
          destination: `lat:${payload.destination.lat},lng:${payload.destination.lng}` || null,
          vehicle_type: payload.carType || null,
          status: payload.status || null,
          price: payload.price || null,
          id_user: payload.id_user || null,
          phone: payload.phone || null,
          moved_at: payload.moved_at || null,
        })
        .then(() => {
          console.log("✅ ข้อมูลถูกเก็บลง history_cus แล้ว");
        })
        .catch((err) => {
          console.error("❌ เก็บข้อมูลลง history_cus ล้มเหลว:", err);
        });
    }
  }, [currentStatus, personalId]);

  useEffect(() => {
    if (booking) {
      // ดึงชื่อสถานที่สำหรับต้นทาง
      fetchLocationName(booking.origin.lat, booking.origin.lng).then((name) =>
        setOriginName(name)
      );

      // ดึงชื่อสถานที่สำหรับปลายทาง
      fetchLocationName(booking.destination.lat, booking.destination.lng).then((name) =>
        setDestinationName(name)
      );
    }
  }, [booking]);

  const handlePayment = () => {
    navigate("/payment", { state: { booking } });
  };

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
              <div
                className={`circle ${
                  index <= currentStepIndex ? "active" : ""
                }`}
              >
                {index <= currentStepIndex ? "✓" : ""}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`line ${index < currentStepIndex ? "active" : ""}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="booking-details">
        <p>
          <strong>รหัสคำสั่งจอง:</strong> {booking.order_id}
        </p>
        <p>
          <strong>ID ผู้ให้บริการ:</strong> {personalId}
        </p>
        <p>
          <strong>ผู้ให้บริการ:</strong> {booking.providerName}
        </p>
        <p>
          <strong>ต้นทาง:</strong> {originName}
        </p>
        <p>
          <strong>ปลายทาง:</strong> {destinationName}
        </p>
        <p>
          <strong>ประเภทรถ:</strong> {booking.carType}
        </p>
        <p>
          <strong>ราคา:</strong> {booking.price} บาท
        </p>
        <p>
          <strong>เวลาที่จอง:</strong>{" "}
          {new Date(booking.time).toLocaleString("th-TH")}
        </p>
        <p>
          <strong>สถานะปัจจุบัน:</strong> {currentStatus}
        </p>
      </div>

      {currentStatus === "รอชำระเงิน" && (
        <button className="btn-back" onClick={handlePayment}>
          💳 ชำระเงิน
        </button>
      )}

      <button className="btn-back" onClick={() => navigate("/home")}>
        กลับหน้าหลัก
      </button>
    </div>
  );
}

export default ServiceStatus;
