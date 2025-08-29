export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cross_references: {
        Row: {
          created_at: string | null
          fabricant: string
          filtre_id: number | null
          id: number
          prix: number | null
          reference: string
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fabricant: string
          filtre_id?: number | null
          id?: number
          prix?: number | null
          reference: string
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fabricant?: string
          filtre_id?: number | null
          id?: number
          prix?: number | null
          reference?: string
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cross_references_filtre_id_fkey"
            columns: ["filtre_id"]
            isOneToOne: false
            referencedRelation: "filtres"
            referencedColumns: ["id"]
          },
        ]
      }
      engin_filtre_compatibility: {
        Row: {
          created_at: string | null
          engin_id: number | null
          filtre_id: number | null
          id: number
        }
        Insert: {
          created_at?: string | null
          engin_id?: number | null
          filtre_id?: number | null
          id?: number
        }
        Update: {
          created_at?: string | null
          engin_id?: number | null
          filtre_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "engin_filtre_compatibility_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engin_filtre_compatibility_filtre_id_fkey"
            columns: ["filtre_id"]
            isOneToOne: false
            referencedRelation: "filtres"
            referencedColumns: ["id"]
          },
        ]
      }
      engins: {
        Row: {
          code: string
          created_at: string | null
          derniere_maintenance_preventive: string | null
          designation: string
          heures: number | null
          id: number
          marque: string
          type: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          derniere_maintenance_preventive?: string | null
          designation: string
          heures?: number | null
          id?: number
          marque: string
          type: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          derniere_maintenance_preventive?: string | null
          designation?: string
          heures?: number | null
          id?: number
          marque?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      filtres: {
        Row: {
          created_at: string | null
          designation: string | null
          fabricant: string
          id: number
          prix: number | null
          reference_principale: string
          stock: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          fabricant: string
          id?: number
          prix?: number | null
          reference_principale: string
          stock?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          fabricant?: string
          id?: number
          prix?: number | null
          reference_principale?: string
          stock?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gammes_entretien: {
        Row: {
          created_at: string | null
          gamme: string
          heures_interval: number
          id: number
          sequence_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gamme: string
          heures_interval: number
          id?: number
          sequence_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gamme?: string
          heures_interval?: number
          id?: number
          sequence_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_preventive: {
        Row: {
          created_at: string | null
          date_execution: string | null
          engin_id: number | null
          filtres_remplaces: number[] | null
          gamme_id: number | null
          heures_service: number
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_execution?: string | null
          engin_id?: number | null
          filtres_remplaces?: number[] | null
          gamme_id?: number | null
          heures_service: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_execution?: string | null
          engin_id?: number | null
          filtres_remplaces?: number[] | null
          gamme_id?: number | null
          heures_service?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_preventive_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_preventive_gamme_id_fkey"
            columns: ["gamme_id"]
            isOneToOne: false
            referencedRelation: "gammes_entretien"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
