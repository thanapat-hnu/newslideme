import { useContext } from "react";
import { RegistrationContext } from "../Context";
import "./popupJob.css";

const PopupJob = () => {
  const { order, setOrder, setStatus } = useContext(RegistrationContext);

  const handleAccept = () => {
    setStatus("working");
  };

  const handleReject = () => {
    setStatus("online");
    setOrder(null);
  };

  if (!order) {
    return null;
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <h3>งานใหม่</h3>
        <div className="order-details">
          <p className="shop-name">ร้าน: {order.shop_name}</p>
          <p className="vehicle-info">ประเภทรถ: {order.vehicle_type}</p>
          <div className="location-details">
            <div className="location-item">
              <strong>ต้นทาง:</strong>
              <p>{order.origin?.address || 'กำลังโหลด...'}</p>
            </div>
            <div className="location-item">
              <strong>ปลายทาง:</strong>
              <p>{order.destination?.address || 'กำลังโหลด...'}</p>
            </div>
          </div>
          <p className="price">ราคา: ฿{order.price?.toLocaleString()}</p>
        </div>
        <div className="action-buttons">
          <button className="accept-btn" onClick={handleAccept}>
            รับงาน
          </button>
          <button className="reject-btn" onClick={handleReject}>
            ปฏิเสธ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupJob;
