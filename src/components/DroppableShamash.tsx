import { useDroppable } from '@dnd-kit/core';
import type { MapMarker } from '../types';

interface DroppableShamashProps {
  rowId: string;
  assignedMarker: MapMarker | null;
  onClear: () => void;
}

export function DroppableShamash({ rowId, assignedMarker, onClear }: DroppableShamashProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `shamash-${rowId}`,
    data: { rowId },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => assignedMarker && onClear()}
      className={`
        w-16 h-12 border-2 flex flex-col items-center justify-center
        cursor-pointer shrink-0 transition-all duration-200
        ${
          isOver
            ? 'border-chalk-gold bg-chalk-gold/10 shadow-chalk-strong drop-zone-active'
            : assignedMarker
            ? 'border-chalk-gold/50 bg-paper-dark/30 shadow-chalk'
            : 'border-pencil-faint/30 border-dashed bg-paper-dark/20 animate-chalk-pulse hover:border-pencil/50'
        }
      `}
      style={{ borderRadius: '50px 15px 45px 10px / 10px 45px 15px 50px' }}
    >
      {assignedMarker ? (
        <>
          <span className="text-lg animate-pencil-flicker opacity-90">🕯️</span>
          <span className="font-sketch text-xs text-chalk-gold truncate max-w-full px-1">
            {assignedMarker.name.split(' ')[0]}
          </span>
        </>
      ) : (
        <>
          <span className={`text-base transition-all ${isOver ? 'text-chalk-gold scale-110' : 'text-pencil-faint/60'}`}>
            {isOver ? '🔥' : '🕯️'}
          </span>
          <span className={`font-sketch text-xs transition-all ${isOver ? 'text-chalk-gold' : 'text-pencil-faint/50'}`}>
            שמש
          </span>
        </>
      )}
    </div>
  );
}
