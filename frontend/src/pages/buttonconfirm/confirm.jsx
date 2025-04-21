import { useState } from 'react';
import './confirm.css';
import axios from 'axios';

function Confirm({
  button,
  setButton,
  local,
  readLocal,
  setReadLocal,
  readLocalB,
  setReadLocal2,
  options,            // ✅ ใช้เป็น carType
  setOptions,
  service,
  setService,
  showService,
  setShowService,
  buttonText,
  setButtonText,
  showMarker,
  setShowMarker,
  setShowfinish,
  showButton,
  setShowButton,
}) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const isButtonVisible = button === 'a' || button === 'b' || (showService && service);

  const isDataValid =
    readLocal.lat !== 0 &&
    readLocal.lng !== 0 &&
    readLocalB.lat !== 0 &&
    readLocalB.lng !== 0 &&
    options !== '' &&
    showButton;

  const shouldDisplay = isButtonVisible || isDataValid;

  const handleConfirm = async () => {
    const map = window.__longdoMapInstance;
    if (!map) {
      console.warn('❗ ไม่พบ longdo map instance');
      return;
    }

    const center = map.location();
    const selected = { lat: center.lat, lng: center.lon };
    console.log('📌 พิกัดหมุดกลาง:', selected);

    try {
      // ✅ ส่งตำแหน่งไป backend
      await axios.post("http://localhost:3000/api/save-location", {
        type: button === 'a' ? 'origin' : 'destination',
        lat: selected.lat,
        lng: selected.lng,
      });

      if (button === 'a') {
        setReadLocal(selected);
        console.log('✅ ยืนยันต้นทาง:', selected);
      } else if (button === 'b') {
        setReadLocal2(selected);
        console.log('✅ ยืนยันปลายทาง:', selected);
      }

      setButton('');

      if (isDataValid && button !== 'a' && button !== 'b') {
        setButtonText('...');
        setShowMarker(true);

        // ✅ ดึงผู้ให้บริการจากพิกัด
        const providers = await axios.get("http://localhost:3000/api/providers", {
          params: { lat: readLocal.lat, lng: readLocal.lng },
        });

        const providerId = providers.data[0]?.id || "P001";
        console.log('📦 ผู้ให้บริการ:', providers.data);

        // ✅ จองบริการพร้อม carType
        await axios.post("http://localhost:3000/api/book-service", {
          origin: readLocal,
          destination: readLocalB,
          providerId,
          carType: options, // ✅ ส่ง carType
          time: new Date().toISOString(),
        });

        // ✅ บันทึกประวัติ
        await axios.post("http://localhost:3000/api/history", {
          userId: "mock_user_01",
          action: "book_service",
          detail: `จองบริการรถลาก (${options}) สำเร็จ`,
        });

        console.log('✅ Booking & history saved');
      }
    } catch (err) {
      console.error("❌ Error during confirm:", err);
    }
  };

  const handleCancel = () => {
    setButtonText('ค้นหาผู้ให้บริการ');
    setShowMarker(false);
    setShowfinish(false);
    setShowCancelPopup(false);
  };

  return (
    <div className="container-button">
      <button
        className="button-d"
        onClick={handleConfirm}
        style={shouldDisplay ? { display: 'flex' } : { display: 'none' }}
      >
        {isDataValid && !showService && button !== 'a' && button !== 'b'
          ? buttonText
          : 'ยืนยัน'}
      </button>

      <button
        className="button-e"
        onClick={() => setShowCancelPopup(!showCancelPopup)}
        style={
          buttonText === '...' && isDataValid
            ? { display: 'flex' }
            : { display: 'none' }
        }
      >
        <i className="bi bi-exclamation-circle"></i>
      </button>

      <div
        className="container-i"
        style={{ display: showCancelPopup ? 'flex' : 'none' }}
      >
        <button className="i1" onClick={() => setShowCancelPopup(false)} />
        <div className="i2">
          <div className="i3">
            <button className="b2" onClick={handleCancel}>
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
