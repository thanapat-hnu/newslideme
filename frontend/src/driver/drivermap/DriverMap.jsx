import { useEffect, useRef } from "react";

function DriverMap() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const waitForLongdo = setInterval(() => {
      if (window.longdo && window.longdo.Map) {
        clearInterval(waitForLongdo);

        const map = new window.longdo.Map({
          placeholder: mapContainerRef.current,
          language: "th",
        });

        // แก้ bug: ตรวจสอบก่อนเรียก Crosshair
        if (map.Ui && map.Ui.Crosshair) {
          map.Ui.Crosshair.visible(false);
        }

        map.location({ lat: 13.736717, lon: 100.523186 });
        map.zoom(13);
      }
    }, 200);
  }, []);

  return (
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
  );
}

export default DriverMap;
