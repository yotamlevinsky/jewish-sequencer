import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { WorldMap } from './WorldMap';
import { Sequencer } from './Sequencer';
import { SidePads } from './SidePads';
import { useStore } from '../store/useStore';
import type { MapMarker } from '../types';

export function Layout() {
  const assignMarkerToRow = useStore((state) => state.assignMarkerToRow);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);

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
      <div className="w-full h-full bg-museum-dark flex flex-col p-4 gap-4">
        {/* Header */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕎</span>
            <div>
              <h1 className="text-2xl font-bold text-gold-light">
                The Jewish Sequence Generator
              </h1>
              <p className="text-xs text-gray-500">
                A Musical Journey Through Jewish Communities Worldwide
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 bg-museum-panel px-3 py-1 rounded-full border border-museum-border">
              Museum Edition
            </span>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left side: Map (top) + Sequencer (bottom) */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Map area - 40% height */}
            <div className="h-[40%] shrink-0">
              <WorldMap />
            </div>

            {/* Sequencer area - 60% height */}
            <div className="flex-1 min-h-0">
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
