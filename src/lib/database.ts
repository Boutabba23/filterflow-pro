import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement Supabase ne sont pas définies');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' : 'non défini');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tester la connexion
supabase.from('filtres').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
    } else {
      console.log('Connexion à Supabase réussie');
    }
  })
  .catch(err => {
    console.error('Erreur lors du test de connexion:', err);
  });

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
