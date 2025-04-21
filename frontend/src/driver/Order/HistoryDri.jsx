import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";

const HistoryDri = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // เปลี่ยนจาก [1, 2] เป็น [9, 10]
    const historyIds = [9, 10];
    const fetchPromises = historyIds.map(id =>
      fetch(`http://localhost:3000/api/driver/history/${id}`)
        .then(async response => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
          }
          return response.json();
        })
        .then(result => result.success ? result.data : null)
        .catch(error => {
          console.error(`Error fetching history ${id}:`, error);
          return null;
        })
    );

    Promise.all(fetchPromises)
      .then(results => {
        const validResults = results.filter(result => result !== null);
        setHistory(validResults);
        if (validResults.length === 0) {
          setError('ไม่พบข้อมูลประวัติ');
        }
      })
      .catch(error => {
        console.error("Error loading histories:", error);
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleBack = () => {
    navigate("/driver/main");
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <button onClick={handleBack} className="back-button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2>ประวัติงาน</h2>
      </div>

      {isLoading ? (
        <div className="loading">กำลังโหลด...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : history.length > 0 ? (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.historyId} className="history-card">
              <div className="history-info">
                <p className="history-date">
                  {new Date(item.orderDateTime).toLocaleString('th-TH')}
                </p>
                <h3>{item.providerName}</h3>
                <div className="location-info">
                  <p>
                    <i className="bi bi-geo-alt-fill text-danger"></i> 
                    จาก: {item.locations.origin.address}
                  </p>
                  <p>
                    <i className="bi bi-geo-alt-fill text-success"></i> 
                    ถึง: {item.locations.destination.address}
                  </p>
                </div>
                <p className="vehicle-type">
                  <i className="bi bi-truck"></i> {item.vehicleType}
                </p>
                <p className="price">฿{item.price.toLocaleString()}</p>
                <p className={`status ${item.status === 'completed' ? 'text-success' : ''}`}>
                  สถานะ: {item.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                </p>
                {item.moveAt && (
                  <p className="move-time">
                    <i className="bi bi-clock"></i>
                    {' '}เวลาเคลื่อนย้าย: {new Date(item.moveAt).toLocaleString('th-TH')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-history">ไม่พบข้อมูลประวัติ</div>
      )}
    </div>
  );
};

export default HistoryDri;