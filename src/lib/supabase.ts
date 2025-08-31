import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Engin {
  id: number
  code: string
  designation: string
  marque: string
  type: string
  heures?: number
  derniere_maintenance_preventive?: string
  created_at?: string
  updated_at?: string
}

export interface Filtre {
  id: number
  reference_principale: string
  type: string
  fabricant: string
  designation?: string
  prix?: number
  stock?: number
  created_at?: string
  updated_at?: string
}

export interface CrossReference {
  id: number
  engin_id: number
  filtre_id: number
  created_at?: string
}

export interface MaintenancePreventive {
  id: number
  engin_id: number
  date_maintenance: string
  description?: string
  created_at?: string
}