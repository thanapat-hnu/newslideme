import styles from "./rabngein.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RegistrationContext } from "../Context";
import io from "socket.io-client";

const Socket = io("http://localhost:3000");
function RabNgein() {
  const navigator = useNavigate();
  const { setStatus } = useContext(RegistrationContext);

  const handleClick = () => {
    setStatus("");
    Socket.emit("statusUpdate", {
      label: "สำเร็จ",
      value: "จัดส่งแล้ว",
    });
    navigator("/driver/main");
  };
  return (
    <div className={styles.container}>
      <label className={styles.price}>1500 บาท</label>
      <button onClick={handleClick} className={styles.button}>
        ยืนยันการชำระเงิน
      </button>
    </div>
  );
}

export default RabNgein;
