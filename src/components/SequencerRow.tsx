import { useStore } from '../store/useStore';
import { DroppableShamash } from './DroppableShamash';
import type { SequencerRow as SequencerRowType } from '../types';

interface SequencerRowProps {
  row: SequencerRowType;
  currentStep: number;
  isPlaying: boolean;
}

export function SequencerRow({ row, currentStep, isPlaying }: SequencerRowProps) {
  const toggleStep = useStore((state) => state.toggleStep);
  const clearRow = useStore((state) => state.clearRow);

  return (
    <div className="flex items-center gap-2 bg-museum-panel rounded-lg p-2 border border-museum-border">
      {/* Shamash (row header / drop zone) */}
      <DroppableShamash
        rowId={row.id}
        assignedMarker={row.assignedMarker}
        onClear={() => clearRow(row.id)}
      />

      {/* 16 Steps (candle sockets) */}
      <div className="flex gap-1 flex-1">
        {row.steps.map((step, index) => {
          const isCurrentStep = isPlaying && currentStep === index;
          const isActive = step.active;

          return (
            <button
              key={index}
              onClick={() => toggleStep(row.id, index)}
              className={`
                w-8 h-14 rounded-md flex items-center justify-center
                transition-all duration-150 relative
                ${
                  isActive
                    ? 'bg-flame-orange/20 border-2 border-flame-orange shadow-flame-subtle'
                    : 'bg-museum-dark border border-museum-border hover:border-gold/30'
                }
                ${isCurrentStep ? 'ring-2 ring-white ring-opacity-50' : ''}
                ${(index + 1) % 4 === 0 && index !== 15 ? 'mr-2' : ''}
              `}
              disabled={!row.assignedMarker}
              title={row.assignedMarker ? `Step ${index + 1}` : 'Assign a sample first'}
            >
              {/* Step number (subtle) */}
              <span
                className={`
                  absolute bottom-0.5 text-[8px]
                  ${isActive ? 'text-flame-orange' : 'text-gray-700'}
                `}
              >
                {index + 1}
              </span>

              {/* Flame icon when active */}
              {isActive && (
                <span className="text-lg flame-icon animate-flicker">
                  🔥
                </span>
              )}

              {/* Socket indicator when inactive but row has sample */}
              {!isActive && row.assignedMarker && (
                <span className="text-gray-600 text-xs">○</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
