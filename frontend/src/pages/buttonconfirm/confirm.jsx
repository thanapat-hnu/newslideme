import { useState, useEffect } from 'react';
import './confirm.css';
import axios from 'axios';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

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
  const userId = "user123";
  const driverId = "driver123";
  const roomId = `${userId}-${driverId}`;

  // ✅ ใช้ useEffect แทน useState สำหรับ logic mount
  useEffect(() => {
    socket.emit("joinRoom", roomId);
    console.log("📡 Confirm component joined room:", roomId);

    // ฟัง event jobConfirmed ที่ส่งกลับมาจาก server
    socket.on("jobConfirmed", (data) => {
      console.log("✅ Confirm received jobConfirmed:", data);
      if (data.jobDetails?.status === "accepted") {
        setButtonText("Service Accepted");
        setShowMarker(true);
        setShowfinish(true);
      }
    });

    return () => {
      socket.off("jobConfirmed");
    };
  }, []);

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
      console.warn('❗ Map instance not found');
      return;
    }

    const center = map.location();
    const selected = { lat: center.lat, lng: center.lon };
    console.log('📌 Center pin coordinates:', selected);

    if (button === 'a') {
      setReadLocal(selected);
      console.log('✅ Origin confirmed:', selected);
      setButton('');
      return;
    } else if (button === 'b') {
      setReadLocal2(selected);
      console.log('✅ Destination confirmed:', selected);
      setButton('');
      return;
    }

    if (isDataValid && !showService && buttonText !== '...') {
      setButtonText('...');
      return;
    }

    // Second click = send booking request
    if (buttonText === '...') {
      console.log('🔍 Sending booking request...');
      const payload = {
        startLocation: readLocal,
        endLocation: readLocalB,
        serviceType: options,
        dateTime: new Date().toISOString(),
        userId,
        driverId
      };

      try {
        const res = await axios.post('http://localhost:3000/api/confirm', payload);
        console.log('✅ Booking confirmed:', res.data);

        // ✅ แก้ตรงนี้: emit เป็น jobRequest แทน jobConfirmed
        socket.emit("jobRequest", {
          roomId,
          jobDetails: payload
        });

        setShowMarker(true);
      } catch (err) {
        console.error('❌ Booking failed:', err);
      }
    }
  };

  const handleCancel = () => {
    setButtonText('Find Service');
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
          : 'Confirm'}
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
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirm;
