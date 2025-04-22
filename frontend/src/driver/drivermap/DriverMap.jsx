// src/driver/home/main/drivermap/DriverMap.jsx
import { useEffect, useRef, useContext, useState } from "react";
import { RegistrationContext } from "../Context";

function DriverMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const { location } = useContext(RegistrationContext);

  // สเตตเพื่อเก็บ URL ไอคอนปัจจุบัน
  const [markerIcon, setMarkerIcon] = useState(
    "https://map.longdo.com/mmmap/images/pin_mark.png"
  );

  // โหลดแผนที่และ route
  useEffect(() => {
    const waitForLongdo = setInterval(() => {
      if (window.longdo && window.longdo.Map) {
        clearInterval(waitForLongdo);
        const map = new window.longdo.Map({
          placeholder: mapContainerRef.current,
          language: "th",
        });
        map.location({ lat: 13.736717, lon: 100.523186 });
        map.zoom(13);
        mapRef.current = map;

        // ซ่อน UI ไม่จำเป็น
        Object.values(map.Ui || {}).forEach((uiCmp) => {
          if (uiCmp.visible) uiCmp.visible(false);
        });
        if (window.longdo.Overlay?.Traffic) {
          map.Overlays.add(window.longdo.Overlay.Traffic);
        }

        // วาดเส้นทาง A > B
        if (
          location?.lonA &&
          location?.latA &&
          location?.lonB &&
          location?.latB
        ) {
          map.Route.clear();
          map.Route.add({ lon: location.lonA, lat: location.latA });
          map.Route.add({ lon: location.lonB, lat: location.latB });
          map.Route.search();
        }
      }
    }, 200);
  }, [location]);

  // อัปเดตตำแหน่งและหมุดทุกวินาที
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation && mapRef.current) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const map = mapRef.current;
            // ลบหมุดเก่า
            if (userMarkerRef.current) {
              map.Overlays.remove(userMarkerRef.current);
            }
            // สร้างหมุดใหม่
            const marker = new window.longdo.Marker(
              { lat: latitude, lon: longitude },
              {
                title: "ตำแหน่งของฉัน",
                icon: {
                  url: markerIcon,
                  offset: { x: 12, y: 45 },
                },
              }
            );
            userMarkerRef.current = marker;
            map.Overlays.add(marker);
          },
          (err) => console.error("ไม่สามารถดึงตำแหน่ง:", err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 1000);
    return () => clearInterval(interval);
  }, [markerIcon]); // สังเกตว่าขึ้นกับ markerIcon

  // ฟังก์ชันสำหรับเปลี่ยนไอคอนหมุด
  const handleChangeMarker = () => {
    // เปลี่ยนเป็นไอคอนตัวอย่างใหม่ (ใส่ URL ของคุณได้เลย)
    setMarkerIcon("https://map.longdo.com/mmmap/images/pin_mark.png");
  };

  // ฟังก์ชัน warp to my location
  const handleWarp = () => {
    if (mapRef.current && userMarkerRef.current) {
      const { lat, lon } = userMarkerRef.current.location();
      mapRef.current.location({ lat, lon }, true);
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <button
          onClick={handleWarp}
          style={{
            padding: "8px 12px",
            marginRight: "8px",
            fontSize: "14px",
            borderRadius: "6px",
            background: "#007aff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          วาร์ปไปตำแหน่งของฉัน
        </button>
        <button
          onClick={handleChangeMarker}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          เปลี่ยนหมุด
        </button>
      </div>

      <div
        ref={mapContainerRef}
        id="driver-map"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />
    </>
  );
}

export default DriverMap;
