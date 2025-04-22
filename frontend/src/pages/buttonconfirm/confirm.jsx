import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ เพิ่ม
import "./confirm.css";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

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
  const [user, setUser] = useState({ firstname: "", lastname: "", phone: "" });
  const navigate = useNavigate(); // ✅ เพิ่ม

  const isButtonVisible =
    button === "a" || button === "b" || (showService && service);
  const isDataValid =
    readLocal.lat !== 0 &&
    readLocal.lng !== 0 &&
    readLocalB.lat !== 0 &&
    readLocalB.lng !== 0 &&
    options !== "" &&
    showButton;

  const shouldDisplay = isButtonVisible || isDataValid;

  // ✅ โหลดชื่อผู้ใช้จาก DB ด้วย phone
  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber");
    if (!phone) return;

    axios
      .get(`http://localhost:3000/api/get-user?phone=${phone}`)
      .then((res) => {
        if (res.data.success) {
          const u = res.data.user;
          setUser({
            firstname: u.firstname,
            lastname: u.lastname,
            phone: u.phone,
          });
        }
      })
      .catch((err) => console.error("❌ ดึงข้อมูลผู้ใช้ล้มเหลว:", err));
  }, []);

  const handleConfirm = async () => {
    const map = window.__longdoMapInstance;
    if (!map) {
      console.warn("❗ ไม่พบ longdo map instance");
      return;
    }

    const center = map.location();
    const selected = { lat: center.lat, lng: center.lon };
    console.log("📌 พิกัดหมุดกลาง:", selected);

    try {
      await axios.post("http://localhost:3000/api/save-location", {
        type: button === "a" ? "origin" : "destination",
        lat: selected.lat,
        lng: selected.lng,
      });

      if (button === "a") {
        setReadLocal(selected);
        console.log("✅ ยืนยันต้นทาง:", selected);
      } else if (button === "b") {
        setReadLocal2(selected);
        console.log("✅ ยืนยันปลายทาง:", selected);
      }

      setButton("");

      if (isDataValid && button !== "a" && button !== "b") {
        setButtonText("...");
        setShowMarker(true);

        const providers = await axios.get(
          "http://localhost:3000/api/providers",
          {
            params: { lat: readLocal.lat, lng: readLocal.lng },
          }
        );

        const providerId = providers.data[0]?.id || "P001";
        console.log("📦 ผู้ให้บริการ:", providers.data);

        // console.log(`readLocal.lat : ${readLocal.lat}`);
        // console.log(`readLocal.lng : ${readLocal.lng}`);

        // console.log(`readLocalB.lat : ${readLocalB.lat}`);
        // console.log(`readLocalB.lng : ${readLocalB.lng}`);

        // ✅ ส่งข้อมูลจองพร้อมเบอร์โทร
        const bookRes = await axios.post(
          "http://localhost:3000/api/book-service",
          {
            origin: readLocal,
            destination: readLocalB,
            providerId,
            carType: options,
            time: new Date().toISOString(),
            phone: user.phone,
          }
        );

        console.log("✅ Booking Response:", bookRes.data);

        // ✅ ไปหน้า servicestatus พร้อมข้อมูล booking
        navigate("/servicestatus", { state: { booking: bookRes.data.booking } });

        console.log("✅ Booking & history saved");

        socket.emit("sendJob", {
          status: "sending",
          orderId: bookRes.data.booking.order_id,
        });

        // socket.emit("jobRequest", {
        //   lonA: readLocal.lng,
        //   latA: readLocal.lat,
        //   lonB: readLocalB.lng,
        //   latB: readLocalB.lat,
        // });
      }
    } catch (err) {
      console.error("❌ Error during confirm:", err);
    }
  };

  const handleCancel = () => {
    setButtonText("ค้นหาผู้ให้บริการ");
    setShowMarker(false);
    setShowfinish(false);
    setShowCancelPopup(false);
  };

  return (
    <div className="container-button">
      <button
        className="button-d"
        onClick={handleConfirm}
        style={shouldDisplay ? { display: "flex" } : { display: "none" }}
      >
        {isDataValid && !showService && button !== "a" && button !== "b"
          ? buttonText
          : "ยืนยัน"}
      </button>

      <button
        className="button-e"
        onClick={() => setShowCancelPopup(!showCancelPopup)}
        style={
          buttonText === "..." && isDataValid
            ? { display: "flex" }
            : { display: "none" }
        }
      >
        <i className="bi bi-exclamation-circle"></i>
      </button>

      <div
        className="container-i"
        style={{ display: showCancelPopup ? "flex" : "none" }}
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
