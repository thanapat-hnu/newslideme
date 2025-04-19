import { useState } from 'react';
import './confirm.css';

function Confirm({
  button,
  setButton,
  local,
  readLocal,
  setReadLocal,
  readLocalB,
  setReadLocal2,
  options,
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

  const handleConfirm = () => {
    const map = window.__longdoMapInstance;
    if (!map) {
      console.warn('❗ ไม่พบ longdo map instance');
      return;
    }

    const center = map.location(); // ✅ ดึงพิกัดจากหมุดกลาง
    const selected = { lat: center.lat, lng: center.lon };
    console.log('📌 พิกัดหมุดกลางจอ:', selected);

    if (button === 'a') {
      setReadLocal(selected);
      console.log('✅ ยืนยันต้นทาง:', selected);
    } else if (button === 'b') {
      setReadLocal2(selected);
      console.log('✅ ยืนยันปลายทาง:', selected);
    }

    setButton('');

    if (isDataValid && !showService && button !== 'a' && button !== 'b') {
      setButtonText('...');
    }

    if (buttonText === '...') {
      console.log('🔍 ค้นหาผู้ให้บริการ...');
      setShowMarker(true);
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
