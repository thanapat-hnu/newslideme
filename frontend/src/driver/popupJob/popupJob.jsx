import style from "./popupJob.module.css";
import { useState, useContext, useEffect } from "react";
import { RegistrationContext } from "../Context";
import io from "socket.io-client";

const Socket = io("http://localhost:3000");

function PopupJob() {
  const {
    status,
    setStatus,
    description,
    setDescription,
    order,
    setOrder,
    personal,
  } = useContext(RegistrationContext);

  const handleClose = () => {
    setStatus("");
  };

  const handleAccept = () => {
    setStatus("working");
    Socket.emit("statusUpdate", {
      label: "ยืนยันคำสั่งจอง",
      value: "รอรับออเดอร์",
    });
  };

  return (
    <div className={style.container}>
      <button className={style.closeButton} onClick={handleClose}>
        ✖
      </button>
      <div className={style.priceSection}>
        <label className={style.price}>{order.price}&nbsp;</label>
        <label className={style.unit}>บาท</label>
      </div>

      <div className={style.locationSection}>
        <div className={style.location}>
          <label className={style.dotGreen}></label>
          {order.origin.address} {/* จุด 1 */}
          <br />
          <label className={style.description}>
            {/* {description.descriptionA} */}
          </label>
        </div>
        <div className={style.verticalLine}></div>
        <div className={style.location}>
          <label className={style.dotRed}></label>
          {order.destination.address} {/* จุด 2 */}
          <br />
          <label className={style.description}>
            {/* {description.descriptionB} */}
          </label>
        </div>
      </div>

      <button className={style.confirmButton} onClick={handleAccept}>
        ยืนยัน
      </button>
    </div>
  );
}

export default PopupJob;
