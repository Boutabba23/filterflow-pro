import { DatabaseCrossReference, DatabaseEngin, DatabaseFiltre, supabase } from './database';

// Engin operations
export const fetchEngins = async () => {
  const { data, error } = await supabase
    .from('engins')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchEnginById = async (id: number) => {
  const { data, error } = await supabase
    .from('engins')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createEngin = async (engin: Omit<DatabaseEngin, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('engins')
    .insert([engin])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateEngin = async (id: number, updates: Partial<DatabaseEngin>) => {
  const { data, error } = await supabase
    .from('engins')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteEngin = async (id: number) => {
  const { error } = await supabase
    .from('engins')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Filtre operations
export const fetchFiltres = async () => {
  const { data, error } = await supabase
    .from('filtres')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchFiltreById = async (id: number) => {
  const { data, error } = await supabase
    .from('filtres')
    .select(`
      *,
      engin_filtre_compatibility (
        id,
        engin:engin_id (
          id,
          code,
          designation
        )
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createFiltre = async (filtre: Omit<DatabaseFiltre, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('filtres')
    .insert([filtre])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateFiltre = async (id: number, updates: Partial<DatabaseFiltre>) => {
  const { data, error } = await supabase
    .from('filtres')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteFiltre = async (id: number) => {
  const { error } = await supabase
    .from('filtres')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Cross reference operations
export const fetchCrossReferences = async (filtreId: number) => {
  const { data, error } = await supabase
    .from('cross_references')
    .select('*')
    .eq('filtre_id', filtreId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createCrossReference = async (crossRef: Omit<DatabaseCrossReference, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('cross_references')
    .insert([crossRef])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCrossReference = async (id: number, updates: Partial<DatabaseCrossReference>) => {
  const { data, error } = await supabase
    .from('cross_references')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCrossReference = async (id: number) => {
  const { error } = await supabase
    .from('cross_references')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
