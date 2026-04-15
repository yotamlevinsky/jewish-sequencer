import { supabase, type AudioSample } from '../lib/supabase'
import type { MapMarker } from '../types'

export async function fetchAudioSamples(): Promise<MapMarker[]> {
  console.log('🔍 Fetching audio samples from Supabase...')

  const { data, error } = await supabase
    .from('audio_library')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Error fetching audio samples:', error)
    return []
  }

  console.log('✅ Fetched samples:', data)

  if (!data || data.length === 0) {
    console.warn('⚠️ No samples found in database')
    return []
  }

  // Convert database records to MapMarker format
  const markers = (data as AudioSample[]).map((sample) => ({
    id: `marker-${sample.id || sample.name}`,
    name: sample.name,
    location: sample.location_name,
    coordinates: [sample.lat, sample.lng] as [number, number],
    audioUrl: sample.audio_url,
    type: sample.type,
    color: sample.color,
    description: `${sample.name} מ${sample.location_name}`,
  }))

  console.log('🎵 Converted to markers:', markers)
  return markers
}
