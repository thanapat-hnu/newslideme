// src/driver/home/main/main.jsx
import { useState, useContext, useEffect } from "react";
import "boxicons";
import styles from "./main.module.css";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { RegistrationContext } from "../Context";
import DriverMap from "../drivermap/DriverMap";
import PopupJob from "../popupJob/popupJob";

const socket = io("http://localhost:3000");

// import Map from '../map/map';

function Main() {
  // const [status, setStatus] = useState(false);
  const [income, setIncome] = useState(false);
  const navigator = useNavigate();
  const { location, setLocation, status, setStatus } =
    useContext(RegistrationContext);

  // test
  // const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    socket.on("jobRequest", (data) => {
      console.log("Received job request:", data);
      // แสดงผลข้อมูล หรือทำสิ่งที่ต้องการ
      setLocation(data);
    });

    return () => {
      // ระวังการ cleanup เพื่อลดการเกิด memory leaks
      socket.off("jobRequest");
    };
  }, []);

  const handleOnline = () => {
    // setStatus(!status);
    setStatus("sending");
    // socket.emit("jobRequest", {
    //   lonA: 100.523186,
    //   latA: 13.736717,
    //   lonB: 100.529186,
    //   latB: 13.741717,
    // });

    // socket.on("jobRequest", (data) => {
    //   setLocation(data);
    // });
  };

  return (
    <div className={styles.containerMain}>
      {/* รายได้,โปรไฟล์ */}
      <div className={styles.btnTop}>
        {/* รายได้ */}
        <button className={styles.btnIncome} onClick={() => setIncome(!income)}>
          <box-icon
            type={income ? "" : "solid"}
            name={income ? "x" : "bar-chart-alt-2"}
            color="#fff"
          ></box-icon>
          &nbsp;{income ? "" : "รายได้"}
        </button>

        {income && (
          <button className={styles.btnIncomeValue}>
            <label className={styles.labelIncome}>รายได้</label>
            <br />
            <label className={styles.labelValue}>1,000</label>
            <label className={styles.labelIcon}>฿</label>
          </button>
        )}

        {/* โปรไฟล์ */}
        <label className={styles.profileImg}></label>
      </div>

      {/* ปุ่มออนไลน์ */}
      <button
        className={styles.btnOnline}
        onClick={handleOnline}
        style={{
          // backgroundColor: status ? "#14BF61" : "#232323",
        }}
      >
        <box-icon name="power-off" color="#ffffff"></box-icon>&nbsp;ออนไลน์
      </button>

      {/* ปุ่มด้านล่าง */}
      <div className={styles.btnBottom}>
        {["btn1", "btn2", "btn3", "btn4"].map((labelText, i) => (
          <div key={i} className={styles[`btnBottomItem${i + 1}`]}>
            <div className={styles.btnBottomIcon}>
              <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
            </div>
            <label>{labelText}</label>
          </div>
        ))}
      </div>

      {/* แผนที่ */}
      <div className={styles.map} id="map">
        <DriverMap />
      </div>

      {status === "sending" && <PopupJob />}
    </div>
  );
}

export default Main;
