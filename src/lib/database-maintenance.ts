import { Database } from "../database.types";
import { supabase } from "./database";
type DatabaseMaintenance = Database['public']['Tables']['maintenance_preventive']['Row'];

export const fetchMaintenances = async () => {
  const { data, error } = await supabase
    .from('maintenance_preventive')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createMaintenance = async (maintenance: Omit<DatabaseMaintenance, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('maintenance_preventive')
    .insert([maintenance])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMaintenance = async (id: number, updates: Partial<DatabaseMaintenance>) => {
  const { data, error } = await supabase
    .from('maintenance_preventive')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMaintenance = async (id: number) => {
  const { error } = await supabase
    .from('maintenance_preventive')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};