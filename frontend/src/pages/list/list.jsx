import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./list.css";

const List = () => {
  const navigate = useNavigate();
  const [slidePage, setSlidePage] = useState(false);
  const [towingData, setTowingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันสุ่มวันที่, เดือน, ปี และเวลา
  const getRandomDateTime = () => {
    const startDate = new Date(2023, 0, 1); // วันที่เริ่มต้น (1 ม.ค. 2023)
    const endDate = new Date(2023, 11, 31); // วันที่สิ้นสุด (31 ธ.ค. 2023)
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );

    const day = randomDate.getDate().toString().padStart(2, "0");
    const month = (randomDate.getMonth() + 1).toString().padStart(2, "0");
    const year = randomDate.getFullYear();

    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);

    return `${day}/${month}/${year} ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/api/towing-list")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((item) => ({
          ...item,
          randomDateTime: getRandomDateTime(),
          locations: {
            origin: { address: item.origin_address },
            destination: { address: item.destination_address },
          },
        }));
        setTowingData(updatedData);
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
            <div className="card" key={item.providerId}>
              <div className="card-row">
                <div className="card-icon green-bg">
                  <i className="bi bi-truck"></i>
                </div>
                <div className="card-info">
                  <p className="card-date">
                    {item.randomDateTime || "ไม่ระบุวันที่"}
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

                  <p className={`card-status green-text`}>กำลังดำเนินการ...</p>
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