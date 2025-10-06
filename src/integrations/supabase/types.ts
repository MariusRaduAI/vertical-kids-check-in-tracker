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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          age_group: string
          category: string
          checked_by: string | null
          checked_in_at: string | null
          child_id: string
          child_name: string
          created_at: string
          date: string
          good_condition_check: boolean | null
          id: string
          is_first_attendance: boolean | null
          no_symptoms_check: boolean | null
          program: string
          status: string
          temperature_check: boolean | null
          unique_code: string | null
        }
        Insert: {
          age_group: string
          category: string
          checked_by?: string | null
          checked_in_at?: string | null
          child_id: string
          child_name: string
          created_at?: string
          date: string
          good_condition_check?: boolean | null
          id?: string
          is_first_attendance?: boolean | null
          no_symptoms_check?: boolean | null
          program: string
          status: string
          temperature_check?: boolean | null
          unique_code?: string | null
        }
        Update: {
          age_group?: string
          category?: string
          checked_by?: string | null
          checked_in_at?: string | null
          child_id?: string
          child_name?: string
          created_at?: string
          date?: string
          good_condition_check?: boolean | null
          id?: string
          is_first_attendance?: boolean | null
          no_symptoms_check?: boolean | null
          program?: string
          status?: string
          temperature_check?: boolean | null
          unique_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_summaries: {
        Row: {
          age_group_0_1_p1: number | null
          age_group_0_1_p2: number | null
          age_group_1_2_p1: number | null
          age_group_1_2_p2: number | null
          age_group_2_3_p1: number | null
          age_group_2_3_p2: number | null
          age_group_4_6_p1: number | null
          age_group_4_6_p2: number | null
          age_group_7_12_p1: number | null
          age_group_7_12_p2: number | null
          category_guest: number | null
          category_membru: number | null
          created_at: string
          date: string
          id: string
          new_children_count: number
          total: number
          total_p1: number
          total_p2: number
          updated_at: string
        }
        Insert: {
          age_group_0_1_p1?: number | null
          age_group_0_1_p2?: number | null
          age_group_1_2_p1?: number | null
          age_group_1_2_p2?: number | null
          age_group_2_3_p1?: number | null
          age_group_2_3_p2?: number | null
          age_group_4_6_p1?: number | null
          age_group_4_6_p2?: number | null
          age_group_7_12_p1?: number | null
          age_group_7_12_p2?: number | null
          category_guest?: number | null
          category_membru?: number | null
          created_at?: string
          date: string
          id?: string
          new_children_count?: number
          total?: number
          total_p1?: number
          total_p2?: number
          updated_at?: string
        }
        Update: {
          age_group_0_1_p1?: number | null
          age_group_0_1_p2?: number | null
          age_group_1_2_p1?: number | null
          age_group_1_2_p2?: number | null
          age_group_2_3_p1?: number | null
          age_group_2_3_p2?: number | null
          age_group_4_6_p1?: number | null
          age_group_4_6_p2?: number | null
          age_group_7_12_p1?: number | null
          age_group_7_12_p2?: number | null
          category_guest?: number | null
          category_membru?: number | null
          created_at?: string
          date?: string
          id?: string
          new_children_count?: number
          total?: number
          total_p1?: number
          total_p2?: number
          updated_at?: string
        }
        Relationships: []
      }
      children: {
        Row: {
          age: number
          age_group: string
          birth_date: string
          category: string
          created_at: string
          days_until_birthday: number
          email: string | null
          first_attendance_date: string | null
          first_name: string
          full_name: string
          id: string
          is_new: boolean | null
          last_name: string
          love_language: string | null
          parents: string[]
          phone: string | null
          profile: string | null
          updated_at: string
        }
        Insert: {
          age: number
          age_group: string
          birth_date: string
          category: string
          created_at?: string
          days_until_birthday: number
          email?: string | null
          first_attendance_date?: string | null
          first_name: string
          full_name: string
          id?: string
          is_new?: boolean | null
          last_name: string
          love_language?: string | null
          parents?: string[]
          phone?: string | null
          profile?: string | null
          updated_at?: string
        }
        Update: {
          age?: number
          age_group?: string
          birth_date?: string
          category?: string
          created_at?: string
          days_until_birthday?: number
          email?: string | null
          first_attendance_date?: string | null
          first_name?: string
          full_name?: string
          id?: string
          is_new?: boolean | null
          last_name?: string
          love_language?: string | null
          parents?: string[]
          phone?: string | null
          profile?: string | null
          updated_at?: string
        }
        Relationships: []
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
