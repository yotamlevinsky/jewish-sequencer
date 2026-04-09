import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import {
  initAudio,
  isAudioInitialized,
  playPadSynth,
  playRecordedBuffer,
  setRecordedBuffer,
  startMicRecording,
  stopMicRecording,
} from '../audio';

export function SidePads() {
  const samplePads = useStore((state) => state.samplePads);
  const toggleRecording = useStore((state) => state.toggleRecording);
  const setRecordedBufferState = useStore((state) => state.setRecordedBuffer);

  // Handle pad click
  const handlePadClick = useCallback(async (padId: string, padIndex: number) => {
    const pad = samplePads[padIndex];

    // Initialize audio if needed
    if (!isAudioInitialized()) {
      await initAudio();
    }

    const isUserPad = padIndex >= 3;

    if (isUserPad) {
      // User recording pad
      if (pad.isRecording) {
        // Stop recording
        try {
          const buffer = await stopMicRecording();
          setRecordedBuffer(padId, buffer);
          setRecordedBufferState(padId, buffer);
        } catch (err) {
          console.error('Failed to stop recording:', err);
          toggleRecording(padId);
        }
      } else if (pad.isUserRecorded && pad.recordedBuffer) {
        // Play recorded sample
        playRecordedBuffer(padId);
      } else {
        // Start recording
        try {
          await startMicRecording();
          toggleRecording(padId);

          // Auto-stop after 4 seconds
          setTimeout(async () => {
            const currentPad = useStore.getState().samplePads.find(p => p.id === padId);
            if (currentPad?.isRecording) {
              try {
                const buffer = await stopMicRecording();
                setRecordedBuffer(padId, buffer);
                setRecordedBufferState(padId, buffer);
              } catch (err) {
                console.error('Failed to auto-stop recording:', err);
                toggleRecording(padId);
              }
            }
          }, 4000);
        } catch (err) {
          console.error('Failed to start recording:', err);
        }
      }
    } else {
      // Preloaded synth pad
      if (pad.synthType && pad.note) {
        playPadSynth(pad.synthType, pad.note);
      }
    }
  }, [samplePads, toggleRecording, setRecordedBufferState]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const keyBindings = ['Q', 'W', 'E', 'A', 'S', 'D'];
      const index = keyBindings.indexOf(key);

      if (index !== -1) {
        e.preventDefault();
        const pad = samplePads[index];
        await handlePadClick(pad.id, index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [samplePads, handlePadClick]);

  // Varied border radii for hand-drawn look
  const padRadii = [
    '45px 12px 40px 8px / 8px 40px 12px 45px',
    '12px 40px 8px 45px / 45px 8px 40px 12px',
    '40px 8px 45px 12px / 12px 45px 8px 40px',
    '8px 45px 12px 40px / 40px 12px 45px 8px',
    '35px 15px 42px 10px / 10px 42px 15px 35px',
    '15px 42px 10px 35px / 35px 10px 42px 15px',
  ];

  return (
    <div
      className="w-full h-full bg-paper-mid/40 border-2 border-pencil-faint/30 p-4 flex flex-col"
      style={{ borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px' }}
    >
      {/* Header */}
      <h2 className="font-sketch text-2xl text-chalk-gold mb-4 tracking-wide">מקלדת חיה</h2>

      {/* Pads grid (2x3) */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {samplePads.map((pad, index) => {
          const isUserPad = index >= 3;
          const hasSound = pad.synthType || pad.isUserRecorded;

          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id, index)}
              className={`
                relative flex flex-col items-center justify-center
                transition-all duration-150 active:scale-95 border-2
                ${
                  pad.isRecording
                    ? 'bg-chalk-gold/10 border-chalk-gold animate-scribble'
                    : hasSound
                    ? 'bg-paper-dark/30 border-pencil-faint/40 hover:border-chalk-gold/60 hover:shadow-chalk'
                    : 'bg-paper-dark/20 border-dashed border-pencil-faint/30 hover:border-pencil/50'
                }
              `}
              style={{ borderRadius: padRadii[index] }}
            >
              {/* Key binding badge */}
              <span
                className={`
                  absolute top-2 right-2 w-6 h-6 flex items-center justify-center
                  font-sketch text-sm
                  ${hasSound ? 'text-chalk-gold' : 'text-pencil-faint/50'}
                `}
              >
                {pad.keyBinding}
              </span>

              {/* Pad content */}
              {pad.isRecording ? (
                <>
                  <span className="text-2xl mb-1 opacity-80">●</span>
                  <span className="font-sketch text-sm text-chalk-gold">מקליט...</span>
                </>
              ) : hasSound ? (
                <>
                  <span className="text-2xl mb-1 opacity-80">
                    {isUserPad ? '🎙️' : '🔥'}
                  </span>
                  <span className="font-sketch text-sm text-pencil-light">{pad.name}</span>
                  {pad.isUserRecorded && (
                    <span className="font-sketch text-xs text-chalk-gold/70 mt-1">הוקלט</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-2xl mb-1 opacity-50">🎤</span>
                  <span className="font-sketch text-sm text-pencil-faint">הקלטה</span>
                </>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
