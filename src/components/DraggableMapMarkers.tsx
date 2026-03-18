import { createPortal } from 'react-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { MapMarker } from '../types';
import { initAudio, isAudioInitialized, playPreview } from '../audio';

interface MarkerPosition {
  id: string;
  x: number;
  y: number;
  marker: MapMarker;
}

interface DraggableMarkerItemProps {
  marker: MapMarker;
  position: { x: number; y: number };
}

function DraggableMarkerItem({ marker, position }: DraggableMarkerItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: marker.id,
    data: { marker },
  });

  const style: React.CSSProperties = {
    position: 'fixed',
    left: position.x - 24,
    top: position.y - 24,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 9999 : 1000,
    touchAction: 'none',
    pointerEvents: 'auto',
  };

  // Play preview sound when clicking
  const handleClick = async () => {
    if (!isAudioInitialized()) {
      await initAudio();
    }
    playPreview(marker.synthType, marker.note);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-80' : ''}
      `}
    >
      {/* Flame with marker-specific color */}
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          transition-transform shadow-lg
          ${isDragging ? 'scale-125' : 'hover:scale-110'}
        `}
        style={{
          background: `radial-gradient(circle at 50% 60%, ${marker.color}, #ff4500)`,
          boxShadow: `0 0 15px ${marker.color}, 0 0 30px ${marker.color}88`,
        }}
      >
        <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' }}>
          🔥
        </span>
      </div>
      {/* Label */}
      {!isDragging && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded text-xs text-white font-bold whitespace-nowrap pointer-events-none"
          style={{
            backgroundColor: marker.color,
            boxShadow: `0 0 10px ${marker.color}`,
          }}
        >
          {marker.name}
        </div>
      )}
    </div>
  );
}

interface DraggableMapMarkersProps {
  positions: MarkerPosition[];
}

export function DraggableMapMarkers({ positions }: DraggableMapMarkersProps) {
  if (positions.length === 0) {
    return null;
  }

  // Render markers using a portal to the body so they can be dragged anywhere
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {positions.map((pos) => (
        <DraggableMarkerItem
          key={pos.id}
          marker={pos.marker}
          position={{ x: pos.x, y: pos.y }}
        />
      ))}
    </div>,
    document.body
  );
}
