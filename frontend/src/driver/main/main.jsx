// src/driver/home/main/main.jsx
import { useState } from "react";
import "boxicons";
import "./main.css";
import DriverMap from "../drivermap/DriverMap";

function Main() {
  const [status, setStatus] = useState(false);
  const [income, setIncome] = useState(false);

  return (
    <div className="container-main">
      {/* รายได้, โปรไฟล์ */}
      <div className="btn-top">
        <button className="btn-income" onClick={() => setIncome(!income)}>
          <box-icon
            type={income ? "" : "solid"}
            name={income ? "x" : "bar-chart-alt-2"}
            color="#fff"
          ></box-icon>
          &nbsp;{income ? "" : "รายได้"}
        </button>
        {income && (
          <button className="btn-income-value">
            <label className="label-income">รายได้</label><br />
            <label className="label-value">1,000</label>
            <label className="label-icon">฿</label>
          </button>
        )}
        <label className="profile-img" />
      </div>

      {/* สถานะ */}
      <button
        className="btn-online"
        onClick={() => setStatus(!status)}
        style={{
          backgroundColor: status ? "#14BF61" : "#232323"
        }}
      >
        <box-icon name="power-off" color="#ffffff"></box-icon>&nbsp;ออนไลน์
      </button>

      {/* ปุ่มด้านล่าง */}
      <div className="btn-bottom">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`btn-bottom-item${n}`}>
            <div className="btn-bottom-icon">
              <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
            </div>
            <label>btn{n}</label>
          </div>
        ))}
      </div>

      {/* ✅ แสดงแผนที่ตรงนี้ */}
      <DriverMap />
    </div>
  );
}

export default Main;
