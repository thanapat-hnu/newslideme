import { useEffect, useRef, useContext } from "react";
import { RegistrationContext } from "../Context";

function DriverMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const { location } = useContext(RegistrationContext);

  useEffect(() => {
    // รอโหลด Longdo map
    const waitForLongdo = setInterval(() => {
      if (window.longdo && window.longdo.Map) {
        clearInterval(waitForLongdo);

        const map = new window.longdo.Map({
          placeholder: mapContainerRef.current,
          language: "th",
        });

        map.location({ lat: 13.736717, lon: 100.523186 }); // ตำแหน่งเริ่มต้น
        map.zoom(13);
        mapRef.current = map;

        // ซ่อน UI
        if (map.Ui?.Crosshair?.visible) map.Ui.Crosshair.visible(false);
        if (map.Ui?.Zoombar?.visible) map.Ui.Zoombar.visible(false);
        if (map.Ui?.Toolbar?.visible) map.Ui.Toolbar.visible(false);
        if (map.Ui?.LayerSelector?.visible) map.Ui.LayerSelector.visible(false);
        if (map.Ui?.Geolocation?.visible) map.Ui.Geolocation.visible(false);
        if (map.Ui?.Fullscreen?.visible) map.Ui.Fullscreen.visible(false);
        if (map.Ui?.Scale?.visible) map.Ui.Scale.visible(false);

        // ติดตามตำแหน่ง location แล้วปักหมุด
        if (location?.lonA && location?.latA && location?.lonB && location?.latB) {
          map.Route.clear(); // เคลียร์ route ก่อน
          map.Route.add({ lon: location.lonA, lat: location.latA }); // จุดเริ่มต้น A
          map.Route.add({ lon: location.lonB, lat: location.latB }); // จุดปลายทาง B
          map.Route.search();
        }

        // เพิ่ม Traffic Overlay
        if (window.longdo?.Overlay?.Traffic) {
          map.Overlays.add(window.longdo.Overlay.Traffic);
        }
      }
    }, 200);
  }, [location]); // 🟢 ใช้ dependency เป็น location เพื่อให้รันทุกครั้งที่ location เปลี่ยน

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
