import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../store/useStore';
import { MapPositionTracker, type MarkerPosition } from './MapMarkerOverlay';
import { DraggableMapMarkers } from './DraggableMapMarkers';

// Hebrew region labels
const REGION_LABELS: Array<{ name: string; coordinates: [number, number]; size?: 'small' | 'medium' | 'large' }> = [
  // Americas
  { name: 'ניו יורק', coordinates: [41.0, -74.0], size: 'medium' },
  // Countries & Regions
  { name: 'פולין', coordinates: [52.0, 19.5], size: 'medium' },
  { name: 'גרמניה', coordinates: [51.0, 10.0], size: 'medium' },
  { name: 'אוקראינה', coordinates: [49.0, 32.0], size: 'medium' },
  { name: 'רוסיה', coordinates: [58.0, 50.0], size: 'large' },
  { name: 'צרפת', coordinates: [46.5, 2.5], size: 'medium' },
  { name: 'ספרד', coordinates: [40.0, -4.0], size: 'medium' },
  { name: 'מרוקו', coordinates: [32.0, -6.0], size: 'medium' },
  { name: 'אלג׳יריה', coordinates: [28.0, 2.0], size: 'medium' },
  { name: 'לוב', coordinates: [27.0, 18.0], size: 'medium' },
  { name: 'מצרים', coordinates: [26.5, 29.0], size: 'medium' },
  { name: 'תורכיה', coordinates: [39.0, 35.0], size: 'medium' },
  { name: 'סוריה', coordinates: [35.0, 38.5], size: 'small' },
  { name: 'עיראק', coordinates: [33.0, 44.0], size: 'medium' },
  { name: 'איראן', coordinates: [32.5, 54.0], size: 'large' },
  { name: 'ישראל', coordinates: [31.5, 35.0], size: 'small' },
  { name: 'תימן', coordinates: [15.5, 48.0], size: 'medium' },
  { name: 'אתיופיה', coordinates: [9.0, 39.0], size: 'medium' },
  { name: 'איטליה', coordinates: [42.5, 12.5], size: 'small' },
  { name: 'יוון', coordinates: [39.0, 22.0], size: 'small' },
  // Seas
  { name: 'הים התיכון', coordinates: [35.0, 18.0], size: 'large' },
  { name: 'הים השחור', coordinates: [43.5, 34.0], size: 'small' },
];

// Create text label icon
const createLabelIcon = (name: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const fontSize = size === 'large' ? '14px' : size === 'medium' ? '11px' : '9px';
  const opacity = size === 'large' ? '0.7' : size === 'medium' ? '0.5' : '0.4';

  return L.divIcon({
    className: 'map-label',
    html: `<span style="
      font-family: 'Frank Ruhl Libre', serif;
      font-size: ${fontSize};
      color: #d4af37;
      opacity: ${opacity};
      text-shadow: 0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6);
      white-space: nowrap;
      pointer-events: none;
      letter-spacing: 1px;
    ">${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

export function WorldMap() {
  const markers = useStore((state) => state.markers);
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([]);

  const handlePositionsUpdate = useCallback((positions: MarkerPosition[]) => {
    setMarkerPositions(positions);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg border border-museum-border">
      {/* Leaflet Map - static view focused on Jewish Diaspora regions */}
      <MapContainer
        center={[42, 25]}
        zoom={3.2}
        className="w-full h-full vintage-map"
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {/* Hebrew region labels */}
        {REGION_LABELS.map((region) => (
          <Marker
            key={region.name}
            position={region.coordinates}
            icon={createLabelIcon(region.name, region.size)}
            interactive={false}
          />
        ))}
        {/* Position tracker - calculates screen positions of markers */}
        <MapPositionTracker
          markers={markers}
          onPositionsUpdate={handlePositionsUpdate}
        />
      </MapContainer>

      {/* Draggable markers - rendered via portal so they can be dragged anywhere */}
      <DraggableMapMarkers positions={markerPositions} />
    </div>
  );
}
