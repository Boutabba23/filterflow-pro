import { supabase } from "@/lib/database";

export interface GammeEntretien {
  id: number;
  gamme: string;
  sequence_order: number;
  heures_interval: number;
}

export interface MaintenanceRecord {
  id: number;
  engin_id: number;
  gamme_id: number;
  heures_service: number;
  date_execution: string;
  date_gamme: string;
  gamme_executee: string;
  filtres_remplaces: number[];
  engin?: {
    id: number;
    code: string;
    designation: string;
    marque: string;
    type: string;
    heures: number;
  };
  gamme?: GammeEntretien;
}

// Récupérer toutes les gammes d'entretien
export const fetchGammes = async (): Promise<GammeEntretien[]> => {
  const { data, error } = await supabase
    .from("gammes_entretien")
    .select("*")
    .order("sequence_order");

  if (error) {
    console.error("Error fetching gammes:", error);
    throw error;
  }

  return data || [];
};

// Récupérer tous les enregistrements de maintenance préventive
export const fetchMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  const { data, error } = await supabase
    .from("maintenance_preventive")
    .select(`
      *,
      engin:engins(*),
      gamme:gammes_entretien(*)
    `)
    .order("date_execution", { ascending: false });

  if (error) {
    console.error("Error fetching maintenance records:", error);
    throw error;
  }

  return data || [];
};

// Créer un nouvel enregistrement de maintenance préventive
export const createMaintenanceRecord = async (record: {
  engin_id: number;
  gamme_id: number;
  heures_service: number;
  date_gamme: string;
  gamme_executee: string;
  filtres_remplaces: number[];
}): Promise<MaintenanceRecord> => {
  const { data, error } = await supabase
    .from("maintenance_preventive")
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error("Error creating maintenance record:", error);
    throw error;
  }

  return data;
};

// Mettre à jour les heures d'un engin
export const updateEnginHours = async (enginId: number, heures: number) => {
  const { error } = await supabase
    .from("engins")
    .update({ heures })
    .eq("id", enginId);

  if (error) {
    console.error("Error updating engin hours:", error);
    throw error;
  }
};

// Récupérer la dernière maintenance pour un engin
export const getLastMaintenanceForEngin = async (enginId: number): Promise<MaintenanceRecord | null> => {
  const { data, error } = await supabase
    .from("maintenance_preventive")
    .select(`
      *,
      engin:engins(*),
      gamme:gammes_entretien(*)
    `)
    .eq("engin_id", enginId)
    .order("date_execution", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
    console.error("Error fetching last maintenance:", error);
    throw error;
  }

  return data;
};

// Calculer la prochaine gamme pour un engin
export const calculateNextGamme = async (enginId: number): Promise<GammeEntretien | null> => {
  try {
    // Récupérer toutes les gammes
    const gammes = await fetchGammes();

    // Récupérer la dernière maintenance
    const lastMaintenance = await getLastMaintenanceForEngin(enginId);

    if (!lastMaintenance) {
      // Première maintenance, retourner la première gamme (C)
      return gammes.find(g => g.sequence_order === 1) || null;
    }

    // Trouver la prochaine gamme dans la séquence
    const lastSequence = lastMaintenance.gamme?.sequence_order || 0;
    const nextSequence = lastSequence >= 8 ? 1 : lastSequence + 1;

    return gammes.find(g => g.sequence_order === nextSequence) || null;
  } catch (error) {
    console.error("Error calculating next gamme:", error);
    throw error;
  }
};
