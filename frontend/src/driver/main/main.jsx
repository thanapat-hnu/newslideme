import "boxicons";
import styles from "./main.module.css";
import { useState } from "react";
// import Map from '../map/map';

function Main() {
  const [status, setStatus] = useState(false);
  const [income, setIncome] = useState(false);

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
        onClick={() => setStatus(!status)}
        style={{
          backgroundColor: status ? "#14BF61" : "#232323",
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
        {/* <Map /> */}
      </div>
    </div>
  );
}

export default Main;
