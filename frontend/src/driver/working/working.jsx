import style from "./working.module.css";
import { useContext, useState, useEffect } from "react";
import { RegistrationContext } from "../Context";

function Working() {
  const { status, setStatus } = useContext(RegistrationContext);
  const [isFull, setIsFull] = useState(true);
  const [time, setTime] = useState(new Date());

  const HandleClick = () => {
    setIsFull(!isFull);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date()); // อัปเดตเวลาทุก 1 วิ
    }, 1000);

    return () => clearInterval(interval); // ล้างเมื่อ component ถูก unmount
  }, []);

  return (
    <div>
      {isFull ? (
        <div className={style.fullContainer}>
          <div className={style.header}>
            <button onClick={HandleClick}>
              <label>
                <box-icon name="chevron-down" color="#fff"></box-icon>
              </label>
              <label style={{ color: "#14BF61", fontSize: "1rem" }}>
                {time.toLocaleTimeString()}
              </label>
              <label style={{ fontSize: "1rem" }}>Slideme</label>
            </button>
          </div>
          <div className={style.content}>
            <label style={{ fontSize: "1.2rem" ,marginBottom:"0.5rem"}}>ชื่อ นามสกุล</label>
            <label className={style.address}>
              ที่อยู่ : Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Non
            </label>
            <label>0&nbsp;บาท</label>
          </div>
          <div className={style.bar}>
            <button className={style.btnBar}>
            <box-icon name="message-rounded" color="#fff" /><br />
              แชท
            </button>
          </div>
          <div className={style.footer}>
            <button className={style.btn}>ถึงแล้ว</button>
          </div>
        </div>
      ) : (
        <div className={style.shortContainer}>
          <div className={style.header}>
            <button onClick={HandleClick}>
              <label>
                <box-icon name="chevron-up" color="#fff"></box-icon>
              </label>
              <label style={{ color: "#14BF61", fontSize: "1rem" }}>
                {time.toLocaleTimeString()}
              </label>
              <label style={{ fontSize: "1rem" }}>Slideme</label>
            </button>
          </div>
          <div className={style.bar}>
            <button className={style.btnBar}>
            <box-icon name="message-rounded" color="#fff" /><br />
              แชท
            </button>
          </div>
          <div className={style.footer}>
            <button className={style.btn}>ถึงแล้ว</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Working;
