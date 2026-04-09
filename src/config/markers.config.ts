import type { MapMarker } from '../types';

/**
 * ============================================
 * FLAME MARKERS CONFIGURATION
 * ============================================
 *
 * To add a new flame marker:
 * 1. Add a new entry to the MARKERS array below
 * 2. Each marker needs:
 *    - id: unique identifier (e.g., 'marker-yemen')
 *    - name: display name (e.g., 'Yemenite')
 *    - location: region description (e.g., 'Yemen')
 *    - coordinates: [latitude, longitude] - use Google Maps to find coordinates
 *    - synthType: 'klezmer' | 'oud' | 'moroccan' (or add new synth types in audioEngine.ts)
 *    - note: musical note to play (e.g., 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4')
 *    - color: hex color for the flame (e.g., '#FF5733')
 *    - description: short description of the music tradition
 *
 * Finding coordinates:
 * - Go to Google Maps
 * - Right-click on a location
 * - Click the coordinates to copy them
 * - Format: [latitude, longitude]
 *
 * Available synth types (add more in src/audio/audioEngine.ts):
 * - 'klezmer': Bright, violin-like (Eastern European)
 * - 'oud': Warm, plucked string (Middle Eastern)
 * - 'moroccan': Percussive, rhythmic (North African)
 */

export const MARKERS: MapMarker[] = [
  // ===== EUROPE =====
  {
    id: 'marker-europe',
    name: 'כליזמר',
    location: 'מזרח אירופה',
    coordinates: [50.0647, 19.9450], // Krakow, Poland
    synthType: 'klezmer',
    note: 'D4',
    color: '#4FC3F7', // Light blue
    description: 'מוזיקת כליזמר מסורתית מקהילות יהודיות במזרח אירופה',
  },

  // ===== MIDDLE EAST =====
  {
    id: 'marker-asia',
    name: 'עוד מזרחי',
    location: 'המזרח התיכון',
    coordinates: [31.7683, 35.2137], // Jerusalem
    synthType: 'oud',
    note: 'A3',
    color: '#FFD54F', // Gold/Yellow
    description: 'מסורות מוזיקליות יהודיות מזרחיות עם נגינות עוד',
  },

  // ===== NORTH AFRICA =====
  {
    id: 'marker-africa',
    name: 'מרוקאי',
    location: 'צפון אפריקה',
    coordinates: [33.9716, -6.8498], // Rabat, Morocco
    synthType: 'moroccan',
    note: 'E4',
    color: '#FF8A65', // Orange/Coral
    description: 'מוזיקה יהודית ספרדית ממרוקו וצפון אפריקה',
  },

  // ===== ADD MORE MARKERS BELOW =====
  // Example:
  // {
  //   id: 'marker-yemen',
  //   name: 'Yemenite',
  //   location: 'Yemen',
  //   coordinates: [15.3694, 44.1910], // Sana'a, Yemen
  //   synthType: 'oud',
  //   note: 'G3',
  //   color: '#CE93D8', // Purple
  //   description: 'Ancient Yemenite Jewish musical traditions',
  // },
];

/**
 * Available musical notes (for reference):
 *
 * Octave 3: C3, D3, E3, F3, G3, A3, B3
 * Octave 4: C4, D4, E4, F4, G4, A4, B4
 * Octave 5: C5, D5, E5, F5, G5, A5, B5
 *
 * With sharps/flats:
 * C#4, Db4, D#4, Eb4, F#4, Gb4, G#4, Ab4, A#4, Bb4
 */

/**
 * Color palette suggestions:
 *
 * Blues: #4FC3F7, #03A9F4, #2196F3, #1976D2
 * Greens: #81C784, #66BB6A, #4CAF50, #388E3C
 * Yellows/Golds: #FFD54F, #FFC107, #FFB300, #FF8F00
 * Oranges: #FF8A65, #FF7043, #FF5722, #E64A19
 * Reds: #E57373, #EF5350, #F44336, #D32F2F
 * Purples: #CE93D8, #BA68C8, #9C27B0, #7B1FA2
 * Pinks: #F48FB1, #F06292, #E91E63, #C2185B
 */
