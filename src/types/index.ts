// Synth type for different instrument sounds
export type SynthType = 'klezmer' | 'oud' | 'moroccan';

// Pad synth types for live pads
export type PadSynthType = 'chant1' | 'chant2' | 'melody1';

// Map marker representing a Jewish community with audio sample
export interface MapMarker {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  synthType: SynthType;
  note: string; // Musical note to play (e.g., "C4", "E4")
  color: string; // Flame color for visual distinction
  description: string;
}

// Single step in the sequencer (candle socket)
export interface SequencerStep {
  active: boolean;
}

// A row in the sequencer (Hanukkiah)
export interface SequencerRow {
  id: string;
  assignedMarker: MapMarker | null;
  steps: SequencerStep[];
}

// Pad for live samples
export interface SamplePad {
  id: string;
  name: string;
  keyBinding: string;
  synthType?: PadSynthType; // For preloaded synth pads
  note?: string; // Note to play
  recordedBuffer?: AudioBuffer; // For user-recorded samples
  isUserRecorded: boolean;
  isRecording: boolean;
}

// Transport state
export interface TransportState {
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
}

// Global app state
export interface AppState {
  // Map markers
  markers: MapMarker[];

  // Sequencer rows (4-8 rows)
  sequencerRows: SequencerRow[];

  // Sample pads (6 pads)
  samplePads: SamplePad[];

  // Transport
  transport: TransportState;

  // Actions
  toggleStep: (rowId: string, stepIndex: number) => void;
  assignMarkerToRow: (markerId: string, rowId: string) => void;
  clearRow: (rowId: string) => void;
  setPlaying: (isPlaying: boolean) => void;
  setCurrentStep: (step: number) => void;
  advanceStep: () => void;
  setBpm: (bpm: number) => void;
  triggerPad: (padId: string) => void;
  toggleRecording: (padId: string) => void;
  setRecordedBuffer: (padId: string, buffer: AudioBuffer) => void;
}
