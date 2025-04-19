import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inputphone.css";

function Inputphone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [animateClass, setAnimateClass] = useState("Inputphone-fadeIn"); // แอนิเมชันเข้า
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const rawInput = e.target.value.replace(/\D/g, "");
    if (rawInput.length <= 10) {
      const formattedNumber = rawInput
        .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        .replace(/(\d{3})(\d{3})/, "$1-$2")
        .replace(/(\d{3})(\d{2})/, "$1-$2");
      setPhoneNumber(formattedNumber);
    }
    setErrorMessage("");
  };

  const handleNext = async () => {
    const rawPhone = phoneNumber.replace(/\D/g, ""); // ลบ - ออก
    if (rawPhone.length !== 10) {
      setErrorMessage("กรุณากรอกหมายเลขโทรศัพท์ให้ครบ 10 หลัก");
      return;
    }
  
    try {
      // 🔍 ตรวจสอบว่าเบอร์มีในระบบ
      const res = await fetch("http://localhost:3000/api/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: rawPhone }),
      });
  
      const result = await res.json();
  
      if (!result.exists) {
        setErrorMessage("ไม่พบเบอร์นี้ในระบบ กรุณาสมัครก่อน");
        return;
      }
  
      // ✅ ถ้ามี → ไปหน้า OTP พร้อมเบอร์
      setAnimateClass("Inputphone-fadeOut");
      setTimeout(() => {
        navigate("/otp", { state: { from: "/inputphone", phoneNumber: rawPhone } });
      }, 500);
    } catch (error) {
      console.error("Error checking phone:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  const handleBack = () => {
    setAnimateClass("Inputphone-fadeOut"); // เริ่มแอนิเมชันออกหน้า
    setTimeout(() => {
      navigate("/login");
    }, 500); // รอให้แอนิเมชันเสร็จสิ้นก่อนเปลี่ยนหน้า
  };

  return (
    <div className={`Inputphone-container ${animateClass}`}>
      <div className="Inputphone-title">
        <button className="back-btn" onClick={handleBack}>⭠</button>
        เข้าสู่ระบบ
      </div>

      <div className="Inputphone-form">
        <h5>เบอร์มือถือ</h5>
        <span className="country-code">🇹🇭 +66</span>
        <input
          type="text"
          className="phone-input"
          value={phoneNumber}
          onChange={handleInputChange}
          maxLength="13"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="Inputphone-next">
        <button className="btn-next" onClick={handleNext}>
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export default Inputphone;
