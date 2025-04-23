import styles from "./rabngein.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { RegistrationContext } from "../Context";
import io from "socket.io-client";

const Socket = io("http://localhost:3000");

function RabNgein() {
  const navigator = useNavigate();
  const { setStatus } = useContext(RegistrationContext);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false); // State สำหรับตรวจสอบการยืนยันการชำระเงิน

  const handleConfirmPayment = () => {
    // อัปเดตสถานะเป็น "จัดส่งแล้ว"
    setStatus("");
    Socket.emit("statusUpdate", {
      label: "สำเร็จ",
      value: "จัดส่งแล้ว",
    });

    // ตั้งค่าว่าได้ยืนยันการชำระเงินแล้ว
    setIsPaymentConfirmed(true);
  };

  const handleGoToMain = () => {
    console.log("Navigating to /driver/main"); // Debug log
    setStatus(""); // รีเซ็ตสถานะ
    navigator("/driver/main", { replace: true }); // นำไปหน้า Main
  };

  return (
    <div className={styles.container}>
      <label className={styles.price}>1500 บาท</label>
      {!isPaymentConfirmed ? (
        <button onClick={handleConfirmPayment} className={styles.button}>
          ยืนยันการชำระเงิน
        </button>
      ) : (
        <button onClick={handleGoToMain} className={styles.button}>
          กลับไปหน้าหลัก
        </button>
      )}
      <p>isPaymentConfirmed: {isPaymentConfirmed.toString()}</p> {/* Debug */}
    </div>
  );
}

export default RabNgein;
