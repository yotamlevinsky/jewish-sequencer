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
        w-16 h-14 rounded-lg border-2 flex flex-col items-center justify-center
        transition-all duration-200 cursor-pointer shrink-0
        ${
          isOver
            ? 'border-gold bg-gold/20 shadow-glow-gold drop-zone-active'
            : assignedMarker
            ? 'border-gold bg-gold/10 border-solid'
            : 'border-museum-border border-dashed hover:border-gold/50 bg-museum-dark'
        }
      `}
      title={assignedMarker ? 'Click to clear' : 'Drop sample here'}
    >
      {assignedMarker ? (
        <>
          <span className="text-xl flame-icon">🕯️</span>
          <span className="text-[10px] text-gold truncate max-w-full px-1">
            {assignedMarker.name.split(' ')[0]}
          </span>
        </>
      ) : (
        <>
          <span className={`text-lg ${isOver ? 'text-gold' : 'text-gray-600'}`}>
            {isOver ? '🔥' : '+'}
          </span>
          <span className={`text-[10px] ${isOver ? 'text-gold' : 'text-gray-600'}`}>
            {isOver ? 'Drop!' : 'Shamash'}
          </span>
        </>
      )}
    </div>
  );
}
