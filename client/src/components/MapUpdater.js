import { useEffect } from 'react';
import {  useMap } from 'react-leaflet';

function MapUpdater({ center, onMoveEnd }) {
  const map = useMap();

  const handleMoveEnd = () => {
  //  const { lat, lng } = map.getCenter();
  //  if (typeof onMoveEnd === 'function') {
  //    onMoveEnd({ latitude: lat, longitude: lng });
  //  }
  };

  useEffect(() => {
    if (center) {
      map.flyTo(center);
      map.on('moveend', handleMoveEnd);
    }
    return () => {
      if (center) {
        map.off('moveend', handleMoveEnd);
      }
    };
  }, [center, map, onMoveEnd]);

  return null;
}

export default MapUpdater
