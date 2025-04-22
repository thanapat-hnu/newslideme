import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { RegistrationContext } from "../Context";
import { useContext } from "react";

const socket = io("http://localhost:3000");

function DriverHome() {
  const navigator = useNavigate();
  const { location, setLocation } = useContext(RegistrationContext);

  return (
    <div className={styles.containerHome}>
      <div className={styles.title}>
        <h1 style={{ margin: "0" }}>SlideMe</h1>
      </div>

      
      <div className={styles.regLog}>
        <h3 style={{ marginBottom: "20px" }}>ลงทะเบียนหรือเข้าสู่ระบบด้วย</h3>
        <button
          className={styles.btnN}
          onClick={() => navigator("/driver/login")}
        >
          <b>กดเข้าสู่ระบบ</b>
        </button>
        <button
          className={styles.btnN}
          onClick={() => navigator("/driver/register")}
        >
          <b>สมัครสมาชิก</b>
        </button>
      </div>
    </div>
  );
}

export default DriverHome;
