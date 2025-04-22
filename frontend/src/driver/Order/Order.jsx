import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ทดสอบด้วย order_id = 7
    const orderId = 7;
    
    fetch(`http://localhost:3000/api/driver/orders/${orderId}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setOrders([result.data]);
        } else {
          console.error("Error:", result.message);
        }
      })
      .catch((error) => console.error("Error loading orders:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleBack = () => {
    navigate("/driver/main");
  };

  const handleHistoryClick = () => {
    navigate("/driver/history");
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <button onClick={handleBack} className="back-button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2>งานที่รับ</h2>
        <button onClick={handleHistoryClick} className="history-button">
          <i className="bi bi-clock-history"></i>
          <span>ประวัติ</span>
        </button>
      </div>

      {isLoading ? (
        <div className="loading">กำลังโหลด...</div>
      ) : orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-info">
                <p className="order-date">
                  {new Date(order.orderDateTime).toLocaleString('th-TH')}
                </p>
                <h3>{order.providerName}</h3>
                <div className="location-info">
                  <p><i className="bi bi-geo-alt-fill"></i> จาก: {order.locations.origin.address}</p>
                  <p><i className="bi bi-geo-alt-fill"></i> ถึง: {order.locations.destination.address}</p>
                </div>
                <p className="vehicle-type">{order.towTruckType}</p>
                <p className="price">฿{order.price}</p>
                <p className="status">สถานะ: {order.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders">ไม่พบข้อมูลงานที่รับ</div>
      )}
    </div>
  );
};

export default Order;