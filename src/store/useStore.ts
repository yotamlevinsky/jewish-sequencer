import { create } from 'zustand';
import type { AppState, SequencerRow, SamplePad, PadSynthType } from '../types';
import { MARKERS } from '../config';

// Create initial sequencer rows (4 rows with 16 steps each)
const createInitialRows = (): SequencerRow[] => {
  return Array.from({ length: 4 }, (_, i) => ({
    id: `row-${i + 1}`,
    assignedMarker: null,
    steps: Array.from({ length: 16 }, () => ({ active: false })),
  }));
};

// Create initial sample pads (6 pads)
// First 3 are preloaded synth pads, last 3 are user recording pads
const createInitialPads = (): SamplePad[] => {
  const keyBindings = ['Q', 'W', 'E', 'A', 'S', 'D'];

  const preloadedPads: Array<{ name: string; synthType: PadSynthType; note: string }> = [
    { name: 'Chant 1', synthType: 'chant1', note: 'C3' },
    { name: 'Chant 2', synthType: 'chant2', note: 'E3' },
    { name: 'Melody', synthType: 'melody1', note: 'G4' },
  ];

  return Array.from({ length: 6 }, (_, i) => {
    if (i < 3) {
      // Preloaded synth pads
      return {
        id: `pad-${i + 1}`,
        name: preloadedPads[i].name,
        keyBinding: keyBindings[i],
        synthType: preloadedPads[i].synthType,
        note: preloadedPads[i].note,
        isUserRecorded: false,
        isRecording: false,
      };
    } else {
      // User recording pads
      return {
        id: `pad-${i + 1}`,
        name: `Record ${i - 2}`,
        keyBinding: keyBindings[i],
        isUserRecorded: false,
        isRecording: false,
      };
    }
  });
};

export const useStore = create<AppState>((set) => ({
  // Initial state
  markers: MARKERS,
  sequencerRows: createInitialRows(),
  samplePads: createInitialPads(),
  transport: {
    isPlaying: false,
    currentStep: 0,
    bpm: 120,
  },

  // Actions
  toggleStep: (rowId, stepIndex) =>
    set((state) => ({
      sequencerRows: state.sequencerRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              steps: row.steps.map((step, i) =>
                i === stepIndex ? { ...step, active: !step.active } : step
              ),
            }
          : row
      ),
    })),

  assignMarkerToRow: (markerId, rowId) =>
    set((state) => {
      const marker = state.markers.find((m) => m.id === markerId);
      if (!marker) return state;

      return {
        sequencerRows: state.sequencerRows.map((row) =>
          row.id === rowId ? { ...row, assignedMarker: marker } : row
        ),
      };
    }),

  clearRow: (rowId) =>
    set((state) => ({
      sequencerRows: state.sequencerRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              assignedMarker: null,
              steps: row.steps.map(() => ({ active: false })),
            }
          : row
      ),
    })),

  setPlaying: (isPlaying) =>
    set((state) => ({
      transport: { ...state.transport, isPlaying },
    })),

  setCurrentStep: (step) =>
    set((state) => ({
      transport: { ...state.transport, currentStep: step },
    })),

  advanceStep: () =>
    set((state) => ({
      transport: {
        ...state.transport,
        currentStep: (state.transport.currentStep + 1) % 16,
      },
    })),

  setBpm: (bpm) =>
    set((state) => ({
      transport: { ...state.transport, bpm },
    })),

  triggerPad: () => {
    // Handled in component
  },

  toggleRecording: (padId) =>
    set((state) => ({
      samplePads: state.samplePads.map((pad) =>
        pad.id === padId ? { ...pad, isRecording: !pad.isRecording } : pad
      ),
    })),

  setRecordedBuffer: (padId, buffer) =>
    set((state) => ({
      samplePads: state.samplePads.map((pad) =>
        pad.id === padId
          ? {
              ...pad,
              recordedBuffer: buffer,
              isUserRecorded: true,
              isRecording: false,
              name: `Recording ${pad.keyBinding}`,
            }
          : pad
      ),
    })),
}));
