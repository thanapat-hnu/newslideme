import { useEffect, useRef, useContext } from "react";
import { RegistrationContext } from "../Context";

function DriverMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null); // 📍 marker ของตำแหน่งปัจจุบัน
  const { location } = useContext(RegistrationContext);

  // 🌐 โหลด Longdo Map และ Route
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
        if (map.Ui?.Crosshair?.visible) map.Ui.Crosshair.visible(false);
        if (map.Ui?.Zoombar?.visible) map.Ui.Zoombar.visible(false);
        if (map.Ui?.Toolbar?.visible) map.Ui.Toolbar.visible(false);
        if (map.Ui?.LayerSelector?.visible) map.Ui.LayerSelector.visible(false);
        if (map.Ui?.Geolocation?.visible) map.Ui.Geolocation.visible(false);
        if (map.Ui?.Fullscreen?.visible) map.Ui.Fullscreen.visible(false);
        if (map.Ui?.Scale?.visible) map.Ui.Scale.visible(false);

        if (window.longdo?.Overlay?.Traffic) {
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

  // 📍 ดึงตำแหน่งปัจจุบันและอัปเดต marker ทุก 3 วินาที
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation && mapRef.current) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const map = mapRef.current;

            // ลบ marker เก่าถ้ามี
            if (userMarkerRef.current) {
              map.Overlays.remove(userMarkerRef.current);
            }

            // สร้าง marker ใหม่
            const marker = new window.longdo.Marker(
              { lat: latitude, lon: longitude },
              {
                title: "ตำแหน่งของฉัน",
                icon: {
                  url: "https://map.longdo.com/mmmap/images/pin_mark.png",
                  offset: { x: 12, y: 45 },
                },
              }
            );
            userMarkerRef.current = marker;
            map.Overlays.add(marker);
          },
          (err) => {
            console.error("ไม่สามารถดึงตำแหน่ง:", err);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    };

    updateLocation(); // เรียกครั้งแรกเลย
    const interval = setInterval(updateLocation, 1000); // แล้วเรียกทุก 3 วิ

    return () => clearInterval(interval); // เคลียร์เมื่อ component ถูก unmount
  }, []);

  return (
    <>
      <button
        onClick={() => {
          if (mapRef.current && userMarkerRef.current) {
            const { lat, lon } = userMarkerRef.current.location();
            mapRef.current.location({ lat, lon }, true); // true = smooth zoom
          }
        }}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: "10px 16px",
          fontSize: "16px",
          borderRadius: "8px",
          background: "#007aff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        วาร์ปไปตำแหน่งของฉัน
      </button>

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
