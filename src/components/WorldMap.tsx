import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useStore } from '../store/useStore';
import { MapPositionTracker, type MarkerPosition } from './MapMarkerOverlay';
import { DraggableMapMarkers } from './DraggableMapMarkers';

export function WorldMap() {
  const markers = useStore((state) => state.markers);
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([]);

  const handlePositionsUpdate = useCallback((positions: MarkerPosition[]) => {
    setMarkerPositions(positions);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg border border-museum-border">
      {/* Leaflet Map - centered to show Europe, Middle East, and North Africa */}
      <MapContainer
        center={[38, 15]}
        zoom={3}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        minZoom={2}
        maxZoom={6}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Position tracker - calculates screen positions of markers */}
        <MapPositionTracker
          markers={markers}
          onPositionsUpdate={handlePositionsUpdate}
        />
      </MapContainer>

      {/* Draggable markers - rendered via portal so they can be dragged anywhere */}
      <DraggableMapMarkers positions={markerPositions} />

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[999] bg-museum-dark/90 rounded-lg p-3 backdrop-blur-sm border border-museum-border">
        <h4 className="text-gold text-xs font-semibold mb-2">Jewish Music Traditions</h4>
        <div className="space-y-1.5">
          {markers.map((marker) => (
            <div key={marker.id} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: marker.color, boxShadow: `0 0 6px ${marker.color}` }}
              />
              <span className="text-gray-300">{marker.name}</span>
              <span className="text-gray-500">({marker.location})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-4 left-4 z-[999] bg-museum-dark/80 rounded-lg px-3 py-2 backdrop-blur-sm border border-museum-border">
        <p className="text-xs text-gray-400">
          <span className="text-gold">Click</span> flames to preview sound, <span className="text-gold">drag</span> to sequencer
        </p>
      </div>
    </div>
  );
}
