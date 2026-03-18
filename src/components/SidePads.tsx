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

  return (
    <div className="w-full h-full bg-museum-panel rounded-lg border border-museum-border p-4 flex flex-col">
      {/* Header */}
      <h2 className="text-gold font-semibold text-lg mb-2">Live Pads</h2>
      <p className="text-xs text-gray-500 mb-4">
        Press keys or click to trigger. Bottom pads record from mic.
      </p>

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
                relative rounded-xl flex flex-col items-center justify-center
                transition-all duration-150 active:scale-95
                ${
                  pad.isRecording
                    ? 'bg-red-500/30 border-2 border-red-500 animate-pulse'
                    : hasSound
                    ? 'bg-museum-dark border-2 border-gold/50 hover:border-gold hover:shadow-glow-gold active:bg-gold/20'
                    : 'bg-museum-dark/50 border-2 border-dashed border-museum-border hover:border-gold/30'
                }
              `}
            >
              {/* Key binding badge */}
              <span
                className={`
                  absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center
                  text-xs font-bold
                  ${hasSound ? 'bg-gold/20 text-gold' : 'bg-gray-800 text-gray-500'}
                `}
              >
                {pad.keyBinding}
              </span>

              {/* Pad content */}
              {pad.isRecording ? (
                <>
                  <span className="text-3xl mb-1">🔴</span>
                  <span className="text-red-400 text-xs font-medium">Recording...</span>
                  <span className="text-red-300 text-[10px] mt-1">Click to stop</span>
                </>
              ) : hasSound ? (
                <>
                  <span className="text-3xl mb-1 flame-icon">
                    {isUserPad ? '🎙️' : '🔥'}
                  </span>
                  <span className="text-white text-sm font-medium">{pad.name}</span>
                  {pad.isUserRecorded && (
                    <span className="text-[10px] text-green-400 mt-1">Recorded</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-3xl mb-1 text-gray-600">🎤</span>
                  <span className="text-gray-500 text-xs">Tap to Record</span>
                  <span className="text-gray-600 text-[10px] mt-1">4 sec max</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-museum-border">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Keys: Q W E / A S D</span>
          <span className="text-gold">Makey Makey Ready</span>
        </div>
      </div>
    </div>
  );
}
