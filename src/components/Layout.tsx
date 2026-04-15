import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import { WorldMap } from './WorldMap';
import { Sequencer } from './Sequencer';
import { SidePads } from './SidePads';
import { useStore } from '../store/useStore';
import type { MapMarker } from '../types';
import { initAudio, loadAudioSample } from '../audio';

export function Layout() {
  const loadMarkers = useStore((state) => state.loadMarkers);
  const markers = useStore((state) => state.markers);
  const assignMarkerToRow = useStore((state) => state.assignMarkerToRow);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);

  // Load markers from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 Loading markers from Supabase...');
      await loadMarkers();
      console.log('✅ Markers loaded, count:', markers.length);
    };
    loadData();
  }, [loadMarkers]);

  // Load audio samples when markers are loaded
  useEffect(() => {
    const loadSamples = async () => {
      // Initialize audio first
      await initAudio();

      // Load each audio sample
      for (const marker of markers) {
        if (marker.audioUrl) {
          await loadAudioSample(marker.id, marker.audioUrl);
        }
      }
    };

    if (markers.length > 0) {
      loadSamples();
    }
  }, [markers]);

  const handleDragStart = (event: DragStartEvent) => {
    const marker = event.active.data.current?.marker as MapMarker | undefined;
    if (marker) {
      setActiveMarker(marker);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveMarker(null);

    const { active, over } = event;

    if (over && over.id.toString().startsWith('shamash-')) {
      const rowId = over.data.current?.rowId as string;
      const markerId = active.id as string;

      if (rowId && markerId) {
        assignMarkerToRow(markerId, rowId);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveMarker(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="w-full h-full flex flex-col p-4 gap-4">
        {/* Header */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl opacity-80">🕎</span>
            <h1 className="font-sketch text-4xl text-chalk-gold tracking-wider">
              חנוכיית הצלילים
            </h1>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left side: Map (top) + Sequencer (bottom) */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Map area - 55% height */}
            <div className="h-[55%] shrink-0">
              <WorldMap />
            </div>

            {/* Sequencer area - scrollable */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <Sequencer />
            </div>
          </div>

          {/* Right side: Live Pads panel */}
          <div className="w-64 shrink-0">
            <SidePads />
          </div>
        </div>
      </div>

      {/* Drag overlay - shows the dragged item following cursor */}
      <DragOverlay>
        {activeMarker ? (
          <div className="flex flex-col items-center pointer-events-none">
            <div
              className="
                w-12 h-12 rounded-full flex items-center justify-center
                bg-gradient-to-b from-flame-yellow to-flame-orange
                shadow-flame
              "
            >
              <span className="text-2xl">🔥</span>
            </div>
            <div className="mt-1 px-2 py-0.5 rounded bg-museum-dark/90 text-xs text-white font-medium whitespace-nowrap border border-gold">
              {activeMarker.name}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
