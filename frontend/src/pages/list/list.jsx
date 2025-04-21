import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./list.css";

const List = () => {
  const navigate = useNavigate();
  const [slidePage, setSlidePage] = useState(false);
  const [towingData, setTowingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const personalId = localStorage.getItem('userId');
    
    if (personalId) {
      fetch(`http://localhost:3000/api/customer-orders/${personalId}`)
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            setTowingData(result.data);
          } else {
            console.error("Error:", result.message);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // ระบุ orderId ที่ต้องการ
    const orderId = 7;
    
    fetch(`http://localhost:3000/api/customer-orders/${orderId}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // แปลงข้อมูลเดี่ยวให้เป็น array เพื่อใช้กับ map
          setTowingData([result.data]);
        } else {
          console.error("Error:", result.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleHistoryClick = () => {
    setSlidePage(true);
    setTimeout(() => {
      navigate("/history");
    }, 500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`list-container ${slidePage ? "slide-in-left" : ""}`}>
      <header className="list-header">
        <span className="list-title">
          รายการ
          <i className="bi bi-file-earmark-text list-icon"></i>
        </span>

        {/* ใส่ div ครอบปุ่มเพื่อความมั่นใจว่ามันจะแสดงผล */}
        <div className="history-btn-container">
          <button className="history-btn" onClick={handleHistoryClick}>
            <i className="bi bi-clock"></i>
            ประวัติ
          </button>
        </div>
      </header>

      <span className="section-heading">รายการล่าสุด</span>

      {/* แสดงรายการข้อมูล */}
      <section className="latest-section">
        {isLoading ? (
          <div className="loading">กำลังโหลดข้อมูล...</div>
        ) : towingData.length > 0 ? (
          towingData.slice(0, 2).map((item) => (
            <div className="card" key={item.orderId}>
              <div className="card-row">
                <div className="card-icon green-bg">
                  <i className="bi bi-truck"></i>
                </div>
                <div className="card-info">
                  <p className="card-date">
                    {formatDate(item.orderDateTime)}
                  </p>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {item.providerName}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <i
                      className="bi bi-geo-alt-fill red"
                      style={{ fontSize: "14px" }}
                    ></i>
                    <p>ต้นทาง: {item.locations.origin.address}</p>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <i
                      className="bi bi-geo-alt-fill green"
                      style={{ fontSize: "14px" }}
                    ></i>
                    <p>ปลายทาง: {item.locations.destination.address}</p>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <i
                      className="bi bi-car-front"
                      style={{ fontSize: "14px" }}
                    ></i>
                    <p>ประเภท: {item.towTruckType}</p>
                  </div>

                  <p className={`card-status ${item.status === 'completed' ? 'green-text' : 'yellow-text'}`}>
                    {item.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ...'}
                  </p>
                </div>
                <div className="card-price">฿ {item.price}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">ไม่พบรายการ</div>
        )}
      </section>
    </div>
  );
};

export default List;