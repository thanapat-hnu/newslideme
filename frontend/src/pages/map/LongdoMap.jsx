import { useEffect, useRef } from 'react';

function LongdoMap({
  readLocal,
  readLocalB,
  showMarker,
  setLocal,
  local,
  mapHeight,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    const checkAndCreateMap = () => {
      if (window.longdo && window.longdo.Map) {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const map = new window.longdo.Map({
          placeholder: mapElement,
          language: 'th',
        });

        map.Ui.Crosshair.visible(false);
        map.location({ lat: 13.736717, lon: 100.523186 });

        map.Event.bind('ready', () => {
          console.log('✅ Longdo Map Ready');

          map.Overlays.clear();
          map.Route.clear();

          if (readLocal.lat && readLocal.lng) {
            const markerA = new window.longdo.Marker({ lat: readLocal.lat, lon: readLocal.lng });
            map.Overlays.add(markerA);
          }

          if (readLocalB.lat && readLocalB.lng) {
            const markerB = new window.longdo.Marker({ lat: readLocalB.lat, lon: readLocalB.lng });
            map.Overlays.add(markerB);
          }

          if (readLocal.lat && readLocalB.lat) {
            map.Route.add({ lat: readLocal.lat, lon: readLocal.lng });
            map.Route.add({ lat: readLocalB.lat, lon: readLocalB.lng });
            map.Route.search();
          }
        });

        // 🧠 เก็บ map instance ไว้ใช้นอก component
        mapRef.current = map;
        window.__longdoMapInstance = map;
      } else {
        setTimeout(checkAndCreateMap, 200);
      }
    };

    checkAndCreateMap();
  }, [readLocal, readLocalB, showMarker]);

  useEffect(() => {
    if (
      mapRef.current &&
      typeof local.lat === 'number' &&
      typeof local.lng === 'number' &&
      !isNaN(local.lat) &&
      !isNaN(local.lng)
    ) {
      try {
        mapRef.current.location({ lat: local.lat, lon: local.lng });
        console.log('📍 Move to:', local);
      } catch (err) {
        console.error('❌ Failed to set location:', err);
      }
    } else {
      console.warn('🚫 Invalid local:', local);
    }
  }, [local]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: mapHeight || '100vh',
        border: '1px solid #ccc',
        zIndex: 1,
      }}
    />
  );
}

export default LongdoMap;
