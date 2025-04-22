import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Inputphone.css";

function Inputphone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [animateClass, setAnimateClass] = useState("Inputphone-fadeIn");
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

  const decodeAndShowToken = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/decode-customer-token",
        { token }
      );
      if (response.data.success) {
        console.log("ข้อมูลลูกค้า:", {
          "ชื่อ": response.data.data.name || 'null',
          "เบอร์โทร": response.data.data.phone || 'null',
          "อีเมล": response.data.data.email || 'null'
        });
      }
    } catch (err) {
      console.error("Token decode error:", err);
    }
  };

  const handleNext = async () => {
    const rawPhone = phoneNumber.replace(/\D/g, "");
    if (rawPhone.length !== 10) {
      setErrorMessage("กรุณากรอกหมายเลขโทรศัพท์ให้ครบ 10 หลัก");
      return;
    }

    try {
      console.log('Sending phone number:', rawPhone); // เพิ่ม logging

      // เช็คว่ามีเบอร์ในระบบ
      const checkResponse = await axios.post(
        "http://localhost:3000/api/check-phone",
        { phoneNumber: rawPhone }
      );

      console.log('Check phone response:', checkResponse.data); // เพิ่ม logging

      if (!checkResponse.data.exists) {
        setErrorMessage("ไม่พบเบอร์นี้ในระบบ กรุณาสมัครก่อน");
        return;
      }

      // ทำการ login
      const loginResponse = await axios.post(
        "http://localhost:3000/api/login-customer",
        { phone: rawPhone } // ส่งในรูปแบบ { phone: "xxxxxxxxxx" }
      );

      console.log('Login response:', loginResponse.data); // เพิ่ม logging

      if (loginResponse.data.success && loginResponse.data.token) {
        localStorage.setItem('customerToken', loginResponse.data.token);
        await decodeAndShowToken(loginResponse.data.token);

        setAnimateClass("Inputphone-fadeOut");
        setTimeout(() => {
          navigate("/otp", { 
            state: { 
              from: "/inputphone", 
              phoneNumber: rawPhone 
            } 
          });
        }, 500);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์"
      );
    }
  };

  const handleBack = () => {
    setAnimateClass("Inputphone-fadeOut");
    setTimeout(() => {
      navigate("/login");
    }, 500);
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
