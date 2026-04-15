import * as Tone from 'tone';
import type { SynthType, PadSynthType } from '../types';

// Store synths for sequencer (legacy - for backward compatibility)
const synths: Map<SynthType, Tone.Synth> = new Map();

// Store synths for pads (longer, more atmospheric sounds)
const padSynths: Map<PadSynthType, Tone.PolySynth> = new Map();

// Store recorded buffers
const recordedBuffers: Map<string, Tone.Player> = new Map();

// Store loaded audio samples from URLs
const audioSamples: Map<string, Tone.Player> = new Map();

// MediaRecorder for mic recording
let mediaRecorder: MediaRecorder | null = null;
let recordingChunks: Blob[] = [];

// Initialize audio context (must be called after user interaction)
let isInitialized = false;

export async function initAudio(): Promise<void> {
  if (isInitialized) return;

  await Tone.start();
  console.log('Audio context started');

  // === SEQUENCER SYNTHS ===

  // Klezmer synth (bright, violin-like)
  const klezmerSynth = new Tone.Synth({
    oscillator: { type: 'sawtooth' as const },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.3,
      release: 0.4,
    },
  }).toDestination();
  klezmerSynth.volume.value = -6;
  synths.set('klezmer', klezmerSynth);

  // Oud synth (warm, plucked string)
  const oudSynth = new Tone.Synth({
    oscillator: { type: 'triangle' as const },
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.2,
      release: 0.8,
    },
  }).toDestination();
  oudSynth.volume.value = -6;
  synths.set('oud', oudSynth);

  // Moroccan synth (percussive, rhythmic)
  const moroccanSynth = new Tone.Synth({
    oscillator: { type: 'square' as const },
    envelope: {
      attack: 0.02,
      decay: 0.15,
      sustain: 0.4,
      release: 0.3,
    },
  }).toDestination();
  moroccanSynth.volume.value = -6;
  synths.set('moroccan', moroccanSynth);

  // === PAD SYNTHS (longer, atmospheric) ===

  // Chant 1 - Deep, sustained choir-like
  const chant1 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' as const },
    envelope: {
      attack: 0.3,
      decay: 0.5,
      sustain: 0.8,
      release: 1.5,
    },
  }).toDestination();
  chant1.volume.value = -8;
  padSynths.set('chant1', chant1);

  // Chant 2 - Brighter, more harmonic
  const chant2 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' as const },
    envelope: {
      attack: 0.2,
      decay: 0.3,
      sustain: 0.7,
      release: 1.2,
    },
  }).toDestination();
  chant2.volume.value = -8;
  padSynths.set('chant2', chant2);

  // Melody 1 - Bell-like, melodic
  const melody1 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' as const },
    envelope: {
      attack: 0.01,
      decay: 0.8,
      sustain: 0.3,
      release: 2.0,
    },
  }).toDestination();
  melody1.volume.value = -6;
  padSynths.set('melody1', melody1);

  isInitialized = true;
}

export function isAudioInitialized(): boolean {
  return isInitialized;
}

// Play a note for sequencer synth
export function playNote(synthType: SynthType, note: string, duration: string = '16n'): void {
  if (!isInitialized) {
    console.warn('Audio not initialized. Call initAudio() first.');
    return;
  }

  const synth = synths.get(synthType);
  if (synth) {
    synth.triggerAttackRelease(note, duration);
  }
}

// Play a preview sound (longer duration)
export function playPreview(synthType: SynthType, note: string): void {
  playNote(synthType, note, '4n');
}

// Load an audio sample from URL
export async function loadAudioSample(id: string, url: string): Promise<void> {
  if (!isInitialized) {
    console.warn('Audio not initialized. Call initAudio() first.');
    return;
  }

  // If already loaded, don't reload
  if (audioSamples.has(id)) {
    return;
  }

  try {
    const player = new Tone.Player({
      url,
      onload: () => {
        console.log(`Loaded audio sample: ${id}`);
      },
    }).toDestination();
    player.volume.value = -6;
    audioSamples.set(id, player);
  } catch (error) {
    console.error(`Failed to load audio sample ${id}:`, error);
  }
}

// Play an audio sample by ID (from URL)
export function playAudioSample(id: string): void {
  if (!isInitialized) {
    console.warn('Audio not initialized');
    return;
  }

  const player = audioSamples.get(id);
  if (player && player.loaded) {
    player.start();
  } else {
    console.warn(`Audio sample ${id} not loaded`);
  }
}

// Play a pad synth (chord/longer sound)
export function playPadSynth(padType: PadSynthType, note: string): void {
  if (!isInitialized) {
    console.warn('Audio not initialized');
    return;
  }

  const synth = padSynths.get(padType);
  if (synth) {
    // Play a chord for richer sound
    const notes = [note];
    synth.triggerAttackRelease(notes, '2n');
  }
}

// Play a recorded buffer
export function playRecordedBuffer(padId: string): void {
  const player = recordedBuffers.get(padId);
  if (player) {
    player.start();
  }
}

// Set recorded buffer for a pad
export function setRecordedBuffer(padId: string, audioBuffer: AudioBuffer): void {
  // Dispose old player if exists
  const oldPlayer = recordedBuffers.get(padId);
  if (oldPlayer) {
    oldPlayer.dispose();
  }

  // Create Tone.js buffer from AudioBuffer
  const toneBuffer = new Tone.ToneAudioBuffer(audioBuffer);
  const player = new Tone.Player(toneBuffer).toDestination();
  player.volume.value = -3;
  recordedBuffers.set(padId, player);
}

// Start recording from microphone
export async function startMicRecording(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordingChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordingChunks.push(e.data);
      }
    };

    mediaRecorder.start();
    console.log('Recording started');
  } catch (err) {
    console.error('Failed to start recording:', err);
    throw err;
  }
}

// Stop recording and return AudioBuffer
export async function stopMicRecording(): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder) {
      reject(new Error('No active recording'));
      return;
    }

    mediaRecorder.onstop = async () => {
      try {
        const blob = new Blob(recordingChunks, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);

        // Stop all tracks
        mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        mediaRecorder = null;
        recordingChunks = [];

        console.log('Recording stopped, buffer created');
        resolve(audioBuffer);
      } catch (err) {
        reject(err);
      }
    };

    mediaRecorder.stop();
  });
}

// Check if currently recording
export function isRecording(): boolean {
  return mediaRecorder !== null && mediaRecorder.state === 'recording';
}

// Set BPM
export function setBpm(bpm: number): void {
  Tone.Transport.bpm.value = bpm;
}

// Cleanup
export function disposeAudio(): void {
  synths.forEach((synth) => synth.dispose());
  synths.clear();
  padSynths.forEach((synth) => synth.dispose());
  padSynths.clear();
  recordedBuffers.forEach((player) => player.dispose());
  recordedBuffers.clear();
  isInitialized = false;
}
