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

  // Generate a slightly random border radius for each row
  const rowVariant = parseInt(row.id.replace('row-', '')) % 3;
  const borderRadii = [
    '255px 15px 225px 15px / 15px 225px 15px 255px',
    '15px 225px 15px 255px / 255px 15px 225px 15px',
    '225px 15px 255px 15px / 15px 255px 15px 225px',
  ];

  return (
    <div
      className="flex items-center gap-2 bg-paper-dark/30 p-2 border border-pencil-faint/20"
      style={{ borderRadius: borderRadii[rowVariant] }}
    >
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
          // Vary border radius per step for hand-drawn feel
          const stepVariant = (index + rowVariant) % 4;
          const stepRadii = [
            '40px 10px 35px 8px / 8px 35px 10px 40px',
            '10px 35px 8px 40px / 40px 8px 35px 10px',
            '35px 8px 40px 10px / 10px 40px 8px 35px',
            '8px 40px 10px 35px / 35px 10px 40px 8px',
          ];

          return (
            <button
              key={index}
              onClick={() => toggleStep(row.id, index)}
              className={`
                flex-1 h-12 flex items-center justify-center
                transition-all duration-150 relative min-w-0 border
                ${
                  isActive
                    ? 'bg-chalk-gold/10 border-chalk-gold/60 shadow-chalk'
                    : 'bg-paper-dark/20 border-pencil-faint/30 hover:border-pencil/50'
                }
                ${isCurrentStep ? 'animate-scribble-fast shadow-chalk-strong' : ''}
                ${(index + 1) % 4 === 0 && index !== 15 ? 'mr-3' : ''}
              `}
              style={{ borderRadius: stepRadii[stepVariant] }}
              disabled={!row.assignedMarker}
            >
              {/* Flame icon when active */}
              {isActive && (
                <span className={`text-base flame-icon ${isCurrentStep ? 'animate-pencil-flicker scale-110' : 'opacity-80'}`}>
                  🔥
                </span>
              )}

              {/* Socket indicator when inactive but row has sample */}
              {!isActive && row.assignedMarker && (
                <span className="text-pencil-faint/40 text-xs">○</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
