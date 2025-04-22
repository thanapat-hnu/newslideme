import React, { useEffect } from 'react';
import './options.css';

function Options({ button, setButton, setOptions, towTruckData, setTowTruckData }) {

  useEffect(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((data) => {
        setTowTruckData(data);
      })
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  // ฟังก์ชันสำหรับ map towTruckType เป็น path ของรูปภาพ
  const getImageByType = (type) => {
    switch (type.toLowerCase()) {
      case 'flatbed':
        return './img/Flatbed.png';
      case 'hook & chain':
        return './img/Hook&Chain.png';
      case 'wheel-lift':
        return './img/Wheel-Lift.png';
      default:
        return './img/default.png'; // fallback
    }
  };

  return (
    <div style={button === 'c' ? { display: 'grid' } : { display: 'none' }} className="container-options">
      <button onClick={() => setButton('')} className="bg-black"></button>

      <div className="bg-selectcar" style={button === 'c' ? { display: 'grid' } : { display: 'none' }}>
        <div className="container-selectcar">
          <div className="title">เลือกประเภทรถ</div>
          <div className="selectcar">
            {towTruckData.map((item) => (
              <button
                key={item.providerId}
                onClick={() => {
                  setOptions(item.towTruckType);
                  setButton('');
                }}
                className="button-selectcar"
              >
                <div className="bg-icon">
                  <img
                    src={getImageByType(item.towTruckType)}
                    alt={item.towTruckType}
                    className="truck-image"
                  />
                </div>
                <div className="text">
                  <p>{item.towTruckType}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Options;
