import styles from "./LoginDriver.module.css";
import { useNavigate } from "react-router-dom";

function LoginDriver() {
  const navigator = useNavigate();

  return (
    <div className={styles.containerLoginDriver}>
      <h1 style={{ margin: "0", color: "#14BF61" }}>สมัครสมาชิก</h1>
      {/* อีเมล */}
      <div className={styles.coolInput}>
        <label className={styles.labelText}>อีเมล :</label>
        <input
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
          type="text"
          placeholder="เลขบัตรประชาชน..."
          name="lastName"
          className={styles.input}
        />
      </div>
      {/* ปุ่ม */}
      <button className={styles.btnLoginDriver} style={{ marginTop: "10px" }}>
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
