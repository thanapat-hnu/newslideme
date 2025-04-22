// src/driver/home/main/main.jsx
import { useState, useContext, useEffect } from "react";
import "boxicons";
import styles from "./main.module.css";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { RegistrationContext } from "../Context";
import DriverMap from "../drivermap/DriverMap";
import PopupJob from "../popupJob/popupJob";
import Working from "../working/working";
import axios from "axios";

const socket = io("http://localhost:3000");

// testcommit
function Main() {
  const [income, setIncome] = useState(false);
  const navigator = useNavigate();
  const { location, setLocation, status, setStatus, order, setOrder } =
    useContext(RegistrationContext);

  useEffect(() => {
    socket.on("sendJob", async (data) => {
      console.log(data);
      setStatus(data.status);
      try {
        const res = await axios.get("http://localhost:3000/api/orders", {
          params: { order_id: data.orderId },
        });
        console.log("API result:", res.data.order);
        setOrder({
          destination: res.data.order.destination,
          order_datetime: res.data.order.order_datetime,
          order_id: res.data.order.order_id,
          origin: res.data.order.origin,
          phone: res.data.order.phone,
          price: res.data.order.price,
          shop_name: res.data.order.shop_name,
          vehicle_type: res.data.order.vehicle_type,
        });
      } catch (err) {
        console.log("API error:", err);
      }
    });

    socket.on("jobRequest", (data) => {
      console.log("Received job request:", data);
      setLocation(data);
    });

    return () => {
      socket.off("jobRequest");
      socket.off("sendJob");
    };
  }, []);

  const handleOnline = () => {
    setStatus("sending");
  };

  return (
    <div className={styles.containerMain}>
      {/* รายได้, โปรไฟล์ */}
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

      {/* ปุ่มด้านล่าง */}
      <div className={styles.btnBottom}>
        <div className={styles.btnBottomItem1}>
          <div className={styles.btnBottomIcon}>
            <box-icon type="logo" name="postgresql" color="#fff"></box-icon>
          </div>
          <label>btn1</label>
        </div>

        <div
          className={styles.btnBottomItem2}
          onClick={() => navigator("/driver/orders")}
        >
          <div className={styles.btnBottomIcon}>
            <box-icon name="task" color="#fff"></box-icon>
          </div>
          <label>งานที่รับ</label>
        </div>

        {["btn3", "btn4"].map((labelText, i) => (
          <div key={i + 3} className={styles[`btnBottomItem${i + 3}`]}>
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
      {status === "working" && <Working />}
    </div>
  );
}

export default Main;
