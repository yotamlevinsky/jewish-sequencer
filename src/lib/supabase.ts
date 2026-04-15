import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptlrpxjkefjdmsdyfior.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bHJweGprZWZqZG1zZHlmaW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjYyNTIsImV4cCI6MjA4OTQwMjI1Mn0.9S2l5tzBYYKP17P7xT4yIUehMLJ14hpcNunSk4cFisE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface AudioSample {
  id?: number
  name: string
  audio_url: string
  type: string
  lat: number
  lng: number
  location_name: string
  color: string
  created_at?: string
}
