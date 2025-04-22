// const PopupJob = () => {
//   return (
//     <div className="popup-container">
//       <div className="popup-content">
//         <h3>งานใหม่</h3>
//         <div className="order-details">
//           <p className="shop-name">ร้าน: {order.shop_name}</p>
//           <p className="vehicle-info">ประเภทรถ: {order.vehicle_type}</p>
//           <div className="location-details">
//             <div className="location-item">
//               <strong>ต้นทาง:</strong>
//               <p>{order.origin?.address || "กำลังโหลด..."}</p>
//             </div>
//             <div className="location-item">
//               <strong>ปลายทาง:</strong>
//               <p>{order.destination?.address || "กำลังโหลด..."}</p>
//             </div>
//           </div>
//           <p className="price">ราคา: ฿{order.price?.toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PopupJob;


import style from "./popupJob.module.css";
import { useState, useContext, useEffect } from "react";
import { RegistrationContext } from "../Context";
import io from "socket.io-client";

const Socket = io("http://localhost:3000");

function PopupJob() {
  const { status, setStatus, description, setDescription, order, setOrder } =
    useContext(RegistrationContext);

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

  //   useEffect(() => {}, []);

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
