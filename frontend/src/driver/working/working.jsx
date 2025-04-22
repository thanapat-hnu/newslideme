import style from "./working.module.css";
import { useContext, useState } from "react";
import { RegistrationContext } from "../Context";

function Working() {
  const { status, setStatus } = useContext(RegistrationContext);
  const [isFull, setIsFull] = useState(true);

  const HandleClick = () => {
    setIsFull(!isFull);
  };

  return (
    <div>
      {isFull ? (
        <div className={style.fullContainer}>
          <div>
            <h1>เวลาปัจจุบัน</h1>
            <h2>Slideme</h2>
          </div>
          <div>
            <label>ชื่อ นามสกุล</label>
            <label>
              ที่อยู่ : Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Non
            </label>
            <label>0&nbsp;บาท</label>
          </div>
          <div>
            <button>แชท</button>
          </div>
          <div>
            <button>ถึงแล้ว</button>
          </div>
          <button onClick={HandleClick}>click</button>
        </div>
      ) : (
        <div className={style.shortContainer}>
          <button onClick={HandleClick}>click</button>
        </div>
      )}
    </div>
  );
}
export default Working;
