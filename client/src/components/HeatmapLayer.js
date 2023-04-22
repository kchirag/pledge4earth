import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

const Heatmap = (props) => {
  const { points, ...options } = props;
  const map = useMap();

  useEffect(() => {
    if (!points) return;

    // Create a new HeatmapLayer instance
    const heatmapLayerInstance = L.heatLayer(points, options);

    // Add HeatmapLayer to the map
    map.addLayer(heatmapLayerInstance);

    // Cleanup on unmount
    return () => {
      map.removeLayer(heatmapLayerInstance);
    };
  }, [map, points, options]);

  return null;
};

export default Heatmap;
