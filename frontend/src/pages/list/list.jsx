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

    fetch("http://localhost:3000/api/get-history")
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
          ประวัติการให้บริการ
          <i className="bi bi-clock-history list-icon"></i>
        </span>
      </header>

      <section className="history-section">
        {isLoading ? (
          <div className="loading">กำลังโหลดข้อมูล...</div>
        ) : towingData.length > 0 ? (
          towingData.map((item) => (
            <div className="card" key={item.history_id}>
              <div className="card-row">
                <div className="card-info">
                  <p className="card-date">{formatDate(item.moved_at)}</p>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {item.shop_name || "ไม่ทราบชื่อร้าน"}
                  </span>
                  <p>ต้นทาง: {item.origin || "ไม่ทราบ"}</p>
                  <p>ปลายทาง: {item.destination || "ไม่ทราบ"}</p>
                  <p>สถานะ: {item.status || "ไม่ทราบ"}</p>
                </div>
                <div className="card-price">฿ {item.price || "N/A"}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">ไม่พบประวัติ</div>
        )}
      </section>
    </div>
  );
};

export default List;