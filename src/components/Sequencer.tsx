import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { SequencerRow } from './SequencerRow';
import { initAudio, isAudioInitialized, playNote, setBpm as setAudioBpm } from '../audio';

export function Sequencer() {
  const sequencerRows = useStore((state) => state.sequencerRows);
  const transport = useStore((state) => state.transport);
  const setPlaying = useStore((state) => state.setPlaying);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const advanceStep = useStore((state) => state.advanceStep);
  const setBpm = useStore((state) => state.setBpm);

  const intervalRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(-1);

  // Play sounds for current step
  const playStepSounds = useCallback((step: number) => {
    if (!isAudioInitialized()) return;

    sequencerRows.forEach((row) => {
      if (row.assignedMarker && row.steps[step]?.active) {
        playNote(row.assignedMarker.synthType, row.assignedMarker.note);
      }
    });
  }, [sequencerRows]);

  // Watch for step changes and play sounds
  useEffect(() => {
    if (transport.isPlaying && transport.currentStep !== lastStepRef.current) {
      lastStepRef.current = transport.currentStep;
      playStepSounds(transport.currentStep);
    }
  }, [transport.isPlaying, transport.currentStep, playStepSounds]);

  // Sequencer loop
  useEffect(() => {
    if (transport.isPlaying) {
      // Calculate interval: (60 / BPM) gives seconds per beat
      // Divide by 4 for 16th notes (4 steps per beat)
      const msPerStep = (60 / transport.bpm) * 1000 / 4;

      intervalRef.current = window.setInterval(() => {
        advanceStep();
      }, msPerStep);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [transport.isPlaying, transport.bpm, advanceStep]);

  // Sync BPM with audio engine
  useEffect(() => {
    if (isAudioInitialized()) {
      setAudioBpm(transport.bpm);
    }
  }, [transport.bpm]);

  // Handle play/pause with audio initialization
  const handlePlayPause = async () => {
    if (transport.isPlaying) {
      setPlaying(false);
      setCurrentStep(0);
      lastStepRef.current = -1;
    } else {
      // Initialize audio on first play (requires user interaction)
      if (!isAudioInitialized()) {
        await initAudio();
        setAudioBpm(transport.bpm);
      }
      setPlaying(true);
    }
  };

  return (
    <div className="w-full h-full bg-paper-mid/50 border-2 border-pencil-faint/30 p-4 flex flex-col"
         style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
      {/* Header with transport controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-sketch text-2xl text-chalk-gold tracking-wide">סקוונסר</h2>
        </div>

        {/* Transport controls */}
        <div className="flex items-center gap-4">
          {/* BPM control */}
          <div className="flex items-center gap-2">
            <label className="font-sketch text-lg text-pencil">קצב</label>
            <input
              type="number"
              value={transport.bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              min={60}
              max={200}
              className="w-16 bg-paper-dark/50 border border-pencil-faint/40 px-2 py-1 text-sm text-pencil-light text-center focus:outline-none focus:border-chalk-gold font-hand"
              style={{ borderRadius: '15px 50px 30px 5px' }}
            />
          </div>

          {/* Current step indicator */}
          <div className="flex items-center gap-2">
            <span className="font-sketch text-lg text-pencil-faint">{transport.currentStep + 1}</span>
          </div>

          {/* Play/Pause button */}
          <button
            onClick={handlePlayPause}
            className={`
              w-12 h-10 flex items-center justify-center
              transition-all duration-200 text-xl border-2
              ${
                transport.isPlaying
                  ? 'bg-chalk-gold/20 text-chalk-gold border-chalk-gold shadow-chalk animate-sketch-wobble'
                  : 'bg-paper-dark/30 border-pencil-faint/40 text-pencil hover:text-chalk-gold hover:border-chalk-gold/50'
              }
            `}
            style={{ borderRadius: '50px 15px 40px 20px / 20px 40px 15px 50px' }}
          >
            {transport.isPlaying ? '◼' : '▶'}
          </button>
        </div>
      </div>

      {/* Sequencer grid */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {sequencerRows.map((row) => (
          <SequencerRow
            key={row.id}
            row={row}
            currentStep={transport.currentStep}
            isPlaying={transport.isPlaying}
          />
        ))}
      </div>

    </div>
  );
}
