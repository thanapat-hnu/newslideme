import styles from "./LoginDriver.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginDriver() {
  const navigator = useNavigate();
  const [drivers, setDrivers] = useState({
    email: "admin@admin.com",
    idCardNumber: "1234567890123",
  });

  const handleLogin = async () => {
    try{
      const res = await axios.post(
        "http://localhost:3000/api/drivers/loginDriver",
        drivers
      );
      // console.log(res.data);
      localStorage.setItem("token", res.data.token);
      // console.log('token : '+localStorage.getItem("token"));
      if(localStorage.getItem("token")){
        navigator("/driver/main");
      }
      // navigator("/driver/main");

    }catch(err){
      console.log(err);
    }
  };
  return (
    <div className={styles.containerLoginDriver}>
      <h1 style={{ margin: "0", color: "#14BF61" }}>สมัครสมาชิก</h1>
      {/* อีเมล */}
      <div className={styles.coolInput}>
        <label className={styles.labelText}>อีเมล :</label>
        <input
          value={drivers.email}
          onChange={(e) => setDrivers({ ...drivers, email: e.target.value })}
          type="text"
          placeholder="อีเมล..."
          name="lastName"
          className={styles.input}
        />
      </div>
      {/* เลขบัตรประชาชน */}
      <div className={styles.coolInput}>
        <label className={styles.labelText}>เลขบัตรประชาชน :</label>
        <input
          value={drivers.idCardNumber}
          onChange={(e) =>
            setDrivers({ ...drivers, idCardNumber: e.target.value })
          }
          type="text"
          placeholder="เลขบัตรประชาชน..."
          name="lastName"
          className={styles.input}
        />
        {/*รรร*/}
      </div>

      {/* ปุ่ม */}
      <button
        onClick={handleLogin}
        className={styles.btnLoginDriver}
        style={{ marginTop: "10px" }}
      >
        เข้าสู่ระบบ
      </button>
      {/* กลับ */}
      <button
        onClick={() => navigator("/driver/index")}
        style={{ marginTop: "10px" }}
      >
        กลับ
      </button>
    </div>
  );
}

export default LoginDriver;
