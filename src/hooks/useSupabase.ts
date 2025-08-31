import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Engin, type Filtre, type MaintenancePreventive } from '@/lib/supabase'

// Engins hooks
export function useEngins() {
  return useQuery({
    queryKey: ['engins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engins')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Engin[]
    }
  })
}

export function useCreateEngin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (engin: Omit<Engin, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('engins')
        .insert([engin])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engins'] })
    }
  })
}

export function useUpdateEngin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, engin }: { id: number, engin: Partial<Engin> }) => {
      const { data, error } = await supabase
        .from('engins')
        .update(engin)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engins'] })
    }
  })
}

export function useDeleteEngin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('engins')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engins'] })
    }
  })
}

// Filtres hooks
export function useFiltres() {
  return useQuery({
    queryKey: ['filtres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filtres')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Filtre[]
    }
  })
}

export function useCreateFiltre() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (filtre: Omit<Filtre, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('filtres')
        .insert([filtre])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtres'] })
    }
  })
}

export function useUpdateFiltre() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, filtre }: { id: number, filtre: Partial<Filtre> }) => {
      const { data, error } = await supabase
        .from('filtres')
        .update(filtre)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtres'] })
    }
  })
}

export function useDeleteFiltre() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('filtres')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filtres'] })
    }
  })
}

// Maintenance hooks
export function useMaintenancePreventive() {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_preventive')
        .select(`
          *,
          engins (
            code,
            designation,
            marque,
            type
          )
        `)
        .order('date_maintenance', { ascending: true })
      
      if (error) throw error
      return data as MaintenancePreventive[]
    }
  })
}

export function useCreateMaintenancePreventive() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (maintenance: Omit<MaintenancePreventive, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('maintenance_preventive')
        .insert([maintenance])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
    }
  })
}