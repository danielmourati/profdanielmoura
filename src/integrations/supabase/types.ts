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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assessment_attempts: {
        Row: {
          answers: Json
          assessment_id: string
          band_label: string | null
          band_message: string | null
          correct_count: number
          created_at: string
          id: string
          score: number
          total_questions: number
          user_id: string | null
        }
        Insert: {
          answers?: Json
          assessment_id: string
          band_label?: string | null
          band_message?: string | null
          correct_count: number
          created_at?: string
          id?: string
          score: number
          total_questions: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          assessment_id?: string
          band_label?: string | null
          band_message?: string | null
          correct_count?: number
          created_at?: string
          id?: string
          score?: number
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          correct_option_id: string
          created_at: string
          id: string
          options: Json
          order_index: number
          question: string
          updated_at: string
        }
        Insert: {
          assessment_id: string
          correct_option_id: string
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          question: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          correct_option_id?: string
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          active: boolean
          created_at: string
          description: string
          file_name: string
          file_type: string
          file_url: string
          icon: string
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          file_name: string
          file_type?: string
          file_url: string
          icon?: string
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          file_name?: string
          file_type?: string
          file_url?: string
          icon?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      flashcard_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      flashcard_sessions: {
        Row: {
          category_id: string | null
          category_name: string | null
          correct: number
          created_at: string
          duration_seconds: number | null
          id: string
          level: string | null
          total: number
          user_id: string
          wrong: number
        }
        Insert: {
          category_id?: string | null
          category_name?: string | null
          correct: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          level?: string | null
          total: number
          user_id: string
          wrong: number
        }
        Update: {
          category_id?: string | null
          category_name?: string | null
          correct?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          level?: string | null
          total?: number
          user_id?: string
          wrong?: number
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          category_id: string
          created_at: string
          difficulty: Database["public"]["Enums"]["flashcard_difficulty"]
          id: string
          order_index: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category_id: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["flashcard_difficulty"]
          id?: string
          order_index?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category_id?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["flashcard_difficulty"]
          id?: string
          order_index?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "flashcard_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          accent: string
          active: boolean
          badge: string | null
          checkout_url: string
          created_at: string
          description: string
          features: Json
          id: string
          image_url: string | null
          order_index: number
          price_cents: number
          title: string
          updated_at: string
        }
        Insert: {
          accent?: string
          active?: boolean
          badge?: string | null
          checkout_url?: string
          created_at?: string
          description?: string
          features?: Json
          id?: string
          image_url?: string | null
          order_index?: number
          price_cents?: number
          title: string
          updated_at?: string
        }
        Update: {
          accent?: string
          active?: boolean
          badge?: string | null
          checkout_url?: string
          created_at?: string
          description?: string
          features?: Json
          id?: string
          image_url?: string | null
          order_index?: number
          price_cents?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      score_bands: {
        Row: {
          assessment_id: string
          color: string
          created_at: string
          id: string
          label: string
          max_score: number
          message: string
          min_score: number
          order_index: number
        }
        Insert: {
          assessment_id: string
          color?: string
          created_at?: string
          id?: string
          label: string
          max_score: number
          message: string
          min_score: number
          order_index?: number
        }
        Update: {
          assessment_id?: string
          color?: string
          created_at?: string
          id?: string
          label?: string
          max_score?: number
          message?: string
          min_score?: number
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "score_bands_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          active: boolean
          avatar_url: string | null
          content: string
          created_at: string
          id: string
          name: string
          order_index: number
          rating: number
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          content: string
          created_at?: string
          id?: string
          name: string
          order_index?: number
          rating?: number
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          rating?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      assessment_questions_public: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          id: string | null
          options: Json | null
          order_index: number | null
          question: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          id?: string | null
          options?: Json | null
          order_index?: number | null
          question?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          id?: string | null
          options?: Json | null
          order_index?: number | null
          question?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_assessment: {
        Args: { p_answers: Json; p_assessment_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      flashcard_difficulty: "facil" | "medio" | "dificil"
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
    Enums: {
      app_role: ["admin", "user"],
      flashcard_difficulty: ["facil", "medio", "dificil"],
    },
  },
} as const
