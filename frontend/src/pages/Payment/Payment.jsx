import React, { useState } from "react";
import "./Payment.css";

function Payment({ onConfirm }) {
  const [method, setMethod] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!method) return alert("กรุณาเลือกวิธีชำระเงินก่อน");
    setConfirmed(true);
    if (onConfirm) onConfirm(method);
  };

  return (
    <div className="payment-container">
      <h2>💳 ชำระเงิน</h2>

      <div className="payment-options">
        <button
          className={`option-btn ${method === "เงินสด" ? "active" : ""}`}
          onClick={() => setMethod("เงินสด")}
        >
          เงินสด
        </button>
        <button
          className={`option-btn ${method === "บัตรเครดิต" ? "active" : ""}`}
          onClick={() => setMethod("บัตรเครดิต")}
        >
          บัตรเครดิต
        </button>
      </div>

      <button className="confirm-button" onClick={handleConfirm}>
        ✅ ยืนยันการชำระเงิน
      </button>

      {confirmed && (
        <div className="confirmed-text">
          📦 ชำระด้วย: <strong>{method}</strong>
        </div>
      )}
    </div>
  );
}

export default Payment;
