import { useEffect, useCallback, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { MapMarker } from '../types';

interface MarkerPosition {
  id: string;
  x: number;
  y: number;
  marker: MapMarker;
}

interface MapPositionTrackerProps {
  markers: MapMarker[];
  onPositionsUpdate: (positions: MarkerPosition[]) => void;
}

// This component runs inside MapContainer to track marker positions
export function MapPositionTracker({ markers, onPositionsUpdate }: MapPositionTrackerProps) {
  const map = useMap();
  const updateTimeoutRef = useRef<number | null>(null);

  const updatePositions = useCallback(() => {
    const container = map.getContainer();
    const rect = container.getBoundingClientRect();

    const newPositions = markers.map((marker) => {
      const point = map.latLngToContainerPoint(marker.coordinates);
      return {
        id: marker.id,
        x: rect.left + point.x,
        y: rect.top + point.y,
        marker,
      };
    });

    onPositionsUpdate(newPositions);
  }, [map, markers, onPositionsUpdate]);

  // Debounced update for smooth performance
  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      window.cancelAnimationFrame(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = window.requestAnimationFrame(updatePositions);
  }, [updatePositions]);

  useEffect(() => {
    // Initial update
    updatePositions();

    // Also update after a short delay to ensure map is fully rendered
    const initialTimeout = setTimeout(updatePositions, 100);
    const secondTimeout = setTimeout(updatePositions, 500);

    // Listen for map events
    map.on('move', debouncedUpdate);
    map.on('moveend', updatePositions);
    map.on('zoom', debouncedUpdate);
    map.on('zoomend', updatePositions);
    map.on('resize', updatePositions);

    // Also update on window resize/scroll
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(secondTimeout);
      if (updateTimeoutRef.current) {
        window.cancelAnimationFrame(updateTimeoutRef.current);
      }
      map.off('move', debouncedUpdate);
      map.off('moveend', updatePositions);
      map.off('zoom', debouncedUpdate);
      map.off('zoomend', updatePositions);
      map.off('resize', updatePositions);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, [map, updatePositions, debouncedUpdate]);

  return null;
}

export type { MarkerPosition };
