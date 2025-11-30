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
      admin_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          affiliate_id: string
          created_at: string | null
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          affiliate_id: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          affiliate_id?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          pix_key: string
          processed_at: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          pix_key: string
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          pix_key?: string
          processed_at?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          confirmed_at: string | null
          created_at: string | null
          customer_email: string
          customer_name: string | null
          id: string
          paid_at: string | null
          payment_id: string | null
          product_name: string | null
          sale_amount: number
          status: string | null
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          confirmed_at?: string | null
          created_at?: string | null
          customer_email: string
          customer_name?: string | null
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          product_name?: string | null
          sale_amount: number
          status?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string | null
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          product_name?: string | null
          sale_amount?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          access_code: string | null
          affiliate_code: string
          approved_at: string | null
          available_balance: number | null
          commission_rate: number | null
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          pix_key: string | null
          status: string | null
          total_earnings: number | null
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          access_code?: string | null
          affiliate_code: string
          approved_at?: string | null
          available_balance?: number | null
          commission_rate?: number | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          pix_key?: string | null
          status?: string | null
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          access_code?: string | null
          affiliate_code?: string
          approved_at?: string | null
          available_balance?: number | null
          commission_rate?: number | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          pix_key?: string | null
          status?: string | null
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          active: boolean | null
          author: string
          badge: string | null
          category: string
          created_at: string | null
          description: string
          duration: string | null
          featured: boolean | null
          format: string | null
          id: string
          image_url: string | null
          language: string | null
          level: string | null
          link: string | null
          long_description: string | null
          price: string
          rating: number
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          author: string
          badge?: string | null
          category: string
          created_at?: string | null
          description: string
          duration?: string | null
          featured?: boolean | null
          format?: string | null
          id?: string
          image_url?: string | null
          language?: string | null
          level?: string | null
          link?: string | null
          long_description?: string | null
          price: string
          rating: number
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          author?: string
          badge?: string | null
          category?: string
          created_at?: string | null
          description?: string
          duration?: string | null
          featured?: boolean | null
          format?: string | null
          id?: string
          image_url?: string | null
          language?: string | null
          level?: string | null
          link?: string | null
          long_description?: string | null
          price?: string
          rating?: number
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vip_access_codes: {
        Row: {
          blocked: boolean | null
          code: string
          created_at: string | null
          device_fingerprint: string | null
          email: string
          first_access_at: string | null
          id: string
          ip_address: string | null
          payment_id: string | null
        }
        Insert: {
          blocked?: boolean | null
          code: string
          created_at?: string | null
          device_fingerprint?: string | null
          email: string
          first_access_at?: string | null
          id?: string
          ip_address?: string | null
          payment_id?: string | null
        }
        Update: {
          blocked?: boolean | null
          code?: string
          created_at?: string | null
          device_fingerprint?: string | null
          email?: string
          first_access_at?: string | null
          id?: string
          ip_address?: string | null
          payment_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_affiliate_access_code: { Args: never; Returns: string }
      generate_affiliate_code: { Args: never; Returns: string }
      generate_short_code: { Args: never; Returns: string }
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
