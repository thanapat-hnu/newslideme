import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OTP.css";

function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [animateClass, setAnimateClass] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const otpInputRef = useRef(null);

  const phoneNumber = location.state?.phoneNumber;
  const fromPage = location.state?.from || "/login";

  useEffect(() => {
    async function sendOtp() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/generate-otp",
          { phoneNumber }
        );
        if (response.data.success) {
          setOtpCode(response.data.otp);
          setShowOtpPopup(true);
          setTimeout(() => setShowOtpPopup(false), 5000);
        } else {
          setErrorMessage("ไม่สามารถส่ง OTP ได้");
        }
      } catch (error) {
        setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    }

    if (phoneNumber) sendOtp();
  }, [phoneNumber]);

  const handleNext = async () => {
    if (!inputCode) {
      setErrorMessage("กรุณากรอก OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/verify-otp",
        {
          phoneNumber,
          otp: inputCode,
        }
      );

      if (response.data.success) {
        if (fromPage === "/register") {
          try {
            const checkRes = await axios.post(
              "http://localhost:3000/api/check-phone",
              { phoneNumber }
            );

            if (!checkRes.data.exists) {
              await axios.post("http://localhost:3000/api/insert-phone", {
                phoneNumber,
              });
            }
          } catch (dbError) {
            console.error("❌ Error checking or inserting phone:", dbError);
          }
        }

        setAnimateClass("OTP-fadeOut");
        setTimeout(() => {
          // ✅ เก็บเบอร์ไว้ใน localStorage เพื่อใช้ในหน้า Profileedit ได้
          localStorage.setItem("phoneNumber", phoneNumber);

          if (fromPage === "/register") {
            navigate("/create", { state: { phoneNumber } });
          } else {
            navigate("/home", { state: { phoneNumber } });
          }
        }, 500);
      } else {
        setErrorMessage("รหัส OTP ไม่ถูกต้อง กรุณาลองอีกครั้ง");
        setInputCode("");
        otpInputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  const handleBack = () => {
    const fromPath = location.state?.from || "/inputphone";
    navigate(fromPath);
  };

  return (
    <div className={`otp-container ${animateClass}`}>
      <div className="otp-title">
        <button className="back-btn-OTP" onClick={handleBack}>
          ⭠
        </button>
        <p className="otp-text">กรอกรหัส 6 หลักที่ส่งไปให้เบอร์ +66</p>
        <p className="otp-number">{phoneNumber}</p>
      </div>

      {showOtpPopup && (
        <div className="otp-popup">
          <p>รหัส OTP ของคุณคือ: {otpCode}</p>
        </div>
      )}

      <div className="input-OTP">
        <input
          ref={otpInputRef}
          type="number"
          className="otp-input"
          value={inputCode}
          onChange={(e) => {
            const value = e.target.value.slice(0, 6);
            setInputCode(value);
            setErrorMessage("");
          }}
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="otp-footer">
        <p>ยังไม่ได้รับ OTP ใช่หรือไม่?</p>
        <button
          className="otp-btn"
          onClick={() => {
            window.location.reload();
          }}
        >
          ขอรหัสใหม่
        </button>
      </div>

      <div className="otp-next">
        <button className="otp-next-btn" onClick={handleNext}>
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export default OTP;
