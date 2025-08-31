import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Engin, InsertEngin, Filtre, InsertFiltre, CrossReference, InsertCrossReference, MaintenancePreventive, InsertMaintenancePreventive } from '@shared/schema';

// API Client
const API_BASE = '/api';

const apiClient = {
  // Engins
  getEngins: async (): Promise<Engin[]> => {
    const response = await fetch(`${API_BASE}/engins`);
    if (!response.ok) throw new Error('Failed to fetch engins');
    return response.json();
  },

  getEngin: async (id: number): Promise<Engin> => {
    const response = await fetch(`${API_BASE}/engins/${id}`);
    if (!response.ok) throw new Error('Failed to fetch engin');
    return response.json();
  },

  createEngin: async (engin: InsertEngin): Promise<Engin> => {
    const response = await fetch(`${API_BASE}/engins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(engin),
    });
    if (!response.ok) throw new Error('Failed to create engin');
    return response.json();
  },

  updateEngin: async (id: number, engin: Partial<InsertEngin>): Promise<Engin> => {
    const response = await fetch(`${API_BASE}/engins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(engin),
    });
    if (!response.ok) throw new Error('Failed to update engin');
    return response.json();
  },

  deleteEngin: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/engins/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete engin');
  },

  // Filtres
  getFiltres: async (): Promise<Filtre[]> => {
    const response = await fetch(`${API_BASE}/filtres`);
    if (!response.ok) throw new Error('Failed to fetch filtres');
    return response.json();
  },

  getFiltre: async (id: number): Promise<Filtre> => {
    const response = await fetch(`${API_BASE}/filtres/${id}`);
    if (!response.ok) throw new Error('Failed to fetch filtre');
    return response.json();
  },

  createFiltre: async (filtre: InsertFiltre): Promise<Filtre> => {
    const response = await fetch(`${API_BASE}/filtres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtre),
    });
    if (!response.ok) throw new Error('Failed to create filtre');
    return response.json();
  },

  updateFiltre: async (id: number, filtre: Partial<InsertFiltre>): Promise<Filtre> => {
    const response = await fetch(`${API_BASE}/filtres/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtre),
    });
    if (!response.ok) throw new Error('Failed to update filtre');
    return response.json();
  },

  deleteFiltre: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/filtres/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete filtre');
  },

  // Cross References
  getCrossReferences: async (filtreId: number): Promise<CrossReference[]> => {
    const response = await fetch(`${API_BASE}/filtres/${filtreId}/cross-references`);
    if (!response.ok) throw new Error('Failed to fetch cross references');
    return response.json();
  },

  createCrossReference: async (crossRef: InsertCrossReference): Promise<CrossReference> => {
    const response = await fetch(`${API_BASE}/cross-references`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crossRef),
    });
    if (!response.ok) throw new Error('Failed to create cross reference');
    return response.json();
  },

  deleteCrossReference: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/cross-references/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete cross reference');
  },

  // Maintenance
  getMaintenanceRecords: async (enginId?: number): Promise<MaintenancePreventive[]> => {
    const url = enginId ? `${API_BASE}/maintenance?enginId=${enginId}` : `${API_BASE}/maintenance`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch maintenance records');
    return response.json();
  },

  createMaintenanceRecord: async (maintenance: InsertMaintenancePreventive): Promise<MaintenancePreventive> => {
    const response = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maintenance),
    });
    if (!response.ok) throw new Error('Failed to create maintenance record');
    return response.json();
  },
};

// React Query Hooks

// Engin hooks
export const useEngins = () => {
  return useQuery({
    queryKey: ['engins'],
    queryFn: apiClient.getEngins,
  });
};

export const useEngin = (id: number) => {
  return useQuery({
    queryKey: ['engins', id],
    queryFn: () => apiClient.getEngin(id),
    enabled: !!id,
  });
};

export const useCreateEngin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createEngin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engins'] });
    },
  });
};

export const useUpdateEngin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, engin }: { id: number; engin: Partial<InsertEngin> }) => 
      apiClient.updateEngin(id, engin),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['engins'] });
      queryClient.invalidateQueries({ queryKey: ['engins', id] });
    },
  });
};

export const useDeleteEngin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteEngin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engins'] });
    },
  });
};

// Filtre hooks
export const useFiltres = () => {
  return useQuery({
    queryKey: ['filtres'],
    queryFn: apiClient.getFiltres,
  });
};

export const useFiltre = (id: number) => {
  return useQuery({
    queryKey: ['filtres', id],
    queryFn: () => apiClient.getFiltre(id),
    enabled: !!id,
  });
};

export const useCreateFiltre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createFiltre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtres'] });
    },
  });
};

export const useUpdateFiltre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, filtre }: { id: number; filtre: Partial<InsertFiltre> }) => 
      apiClient.updateFiltre(id, filtre),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['filtres'] });
      queryClient.invalidateQueries({ queryKey: ['filtres', id] });
    },
  });
};

export const useDeleteFiltre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteFiltre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtres'] });
    },
  });
};

// Cross reference hooks
export const useCrossReferences = (filtreId: number) => {
  return useQuery({
    queryKey: ['cross-references', filtreId],
    queryFn: () => apiClient.getCrossReferences(filtreId),
    enabled: !!filtreId,
  });
};

export const useCreateCrossReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createCrossReference,
    onSuccess: (_, crossRef) => {
      if (crossRef.filtre_id) {
        queryClient.invalidateQueries({ queryKey: ['cross-references', crossRef.filtre_id] });
      }
    },
  });
};

export const useDeleteCrossReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.deleteCrossReference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cross-references'] });
    },
  });
};

// Maintenance hooks
export const useMaintenanceRecords = (enginId?: number) => {
  return useQuery({
    queryKey: ['maintenance', enginId],
    queryFn: () => apiClient.getMaintenanceRecords(enginId),
  });
};

export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.createMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};