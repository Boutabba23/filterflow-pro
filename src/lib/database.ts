import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface DatabaseEngin {
  filtres: any;
  id: number;
  code: string;
  designation: string;
  marque: string;
  type: string;
  heures: number;
  
  derniere_maintenance_preventive: string;
 
 
  created_at: string;
  updated_at: string;
}

export interface DatabaseFiltre {
  id: number;
  reference_principale: string;
  designation: string; // Changé de 'designation' à 'description'
  type: string;
  fabricant: string;
  prix?: number;
  stock: number;
  
  created_at: string;
  updated_at: string;
}

export interface DatabaseCrossReference {
  id: number;
  filtre_id: number;
  reference: string;
  fabricant: string;
  prix?: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseEnginFiltreCompatibility {
  id: number;
  engin_id: number;
  filtre_id: number;
  created_at?: string;
}
