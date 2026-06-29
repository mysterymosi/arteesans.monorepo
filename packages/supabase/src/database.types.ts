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
      addresses: {
        Row: {
          city_lga: string | null
          created_at: string
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          location: unknown
          state: string | null
          user_id: string
        }
        Insert: {
          city_lga?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          location?: unknown
          state?: string | null
          user_id: string
        }
        Update: {
          city_lga?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          location?: unknown
          state?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_actions: {
        Row: {
          action_type: string
          actor_id: string | null
          admin_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          admin_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          admin_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_profiles: {
        Row: {
          additional_skill_category_ids: string[]
          address: string | null
          availability: Database["public"]["Enums"]["availability"] | null
          average_rating: number
          bio: string | null
          cancellation_rate: number
          city_lga: string | null
          completed_jobs: number
          created_at: string
          id: string
          location: unknown
          primary_skill_category_id: string | null
          state: string | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          years_experience: string | null
        }
        Insert: {
          additional_skill_category_ids?: string[]
          address?: string | null
          availability?: Database["public"]["Enums"]["availability"] | null
          average_rating?: number
          bio?: string | null
          cancellation_rate?: number
          city_lga?: string | null
          completed_jobs?: number
          created_at?: string
          id?: string
          location?: unknown
          primary_skill_category_id?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          years_experience?: string | null
        }
        Update: {
          additional_skill_category_ids?: string[]
          address?: string | null
          availability?: Database["public"]["Enums"]["availability"] | null
          average_rating?: number
          bio?: string | null
          cancellation_rate?: number
          city_lga?: string | null
          completed_jobs?: number
          created_at?: string
          id?: string
          location?: unknown
          primary_skill_category_id?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_profiles_primary_skill_category_id_fkey"
            columns: ["primary_skill_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          average_rating_given: number | null
          created_at: string
          default_address_id: string | null
          id: string
          total_bookings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_rating_given?: number | null
          created_at?: string
          default_address_id?: string | null
          id?: string
          total_bookings?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_rating_given?: number | null
          created_at?: string
          default_address_id?: string | null
          id?: string
          total_bookings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_default_address_fkey"
            columns: ["default_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      job_status_notifications: {
        Row: {
          request_id: string
          sent_at: string
          status: Database["public"]["Enums"]["request_status"]
        }
        Insert: {
          request_id: string
          sent_at?: string
          status: Database["public"]["Enums"]["request_status"]
        }
        Update: {
          request_id?: string
          sent_at?: string
          status?: Database["public"]["Enums"]["request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "job_status_notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_artisan_interests: {
        Row: {
          artisan_id: string
          created_at: string
          id: string
          request_id: string
          status: Database["public"]["Enums"]["request_interest_status"]
          updated_at: string
        }
        Insert: {
          artisan_id: string
          created_at?: string
          id?: string
          request_id: string
          status?: Database["public"]["Enums"]["request_interest_status"]
          updated_at?: string
        }
        Update: {
          artisan_id?: string
          created_at?: string
          id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["request_interest_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_artisan_interests_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_artisan_interests_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string
          device_name: string | null
          expo_push_token: string
          id: string
          platform: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name?: string | null
          expo_push_token: string
          id?: string
          platform?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string | null
          expo_push_token?: string
          id?: string
          platform?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          starting_price_max: number | null
          starting_price_min: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          starting_price_max?: number | null
          starting_price_min?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          starting_price_max?: number | null
          starting_price_min?: number | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          accept_deadline_at: string | null
          address: string
          assigned_artisan_id: string | null
          budget: number | null
          category_id: string
          completion_media_paths: string[]
          created_at: string
          customer_confirmed_at: string | null
          customer_id: string
          description: string
          id: string
          location: unknown
          media_paths: string[]
          preferred_time: string | null
          reject_reason: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          accept_deadline_at?: string | null
          address: string
          assigned_artisan_id?: string | null
          budget?: number | null
          category_id: string
          completion_media_paths?: string[]
          created_at?: string
          customer_confirmed_at?: string | null
          customer_id: string
          description: string
          id?: string
          location?: unknown
          media_paths?: string[]
          preferred_time?: string | null
          reject_reason?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          accept_deadline_at?: string | null
          address?: string
          assigned_artisan_id?: string | null
          budget?: number | null
          category_id?: string
          completion_media_paths?: string[]
          created_at?: string
          customer_confirmed_at?: string | null
          customer_id?: string
          description?: string
          id?: string
          location?: unknown
          media_paths?: string[]
          preferred_time?: string | null
          reject_reason?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_assigned_artisan_id_fkey"
            columns: ["assigned_artisan_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_photo_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          artisan_profile_id: string
          doc_type: string
          file_name: string | null
          id: string
          storage_path: string
          uploaded_at: string
        }
        Insert: {
          artisan_profile_id: string
          doc_type: string
          file_name?: string | null
          id?: string
          storage_path: string
          uploaded_at?: string
        }
        Update: {
          artisan_profile_id?: string
          doc_type?: string
          file_name?: string | null
          id?: string
          storage_path?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_artisan_profile_id_fkey"
            columns: ["artisan_profile_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_service_request_details: {
        Row: {
          address: string
          budget: number | null
          category_id: string
          created_at: string
          customer_id: string
          description: string
          id: string
          latitude: number | null
          longitude: number | null
          media_paths: string[]
          preferred_time: string | null
          status: Database["public"]["Enums"]["request_status"]
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      confirm_booking: {
        Args: { p_request_id: string }
        Returns: Database["public"]["Enums"]["request_status"]
      }
      decline_selected_job: {
        Args: { p_reason?: string; p_request_id: string }
        Returns: Database["public"]["Enums"]["request_status"]
      }
      express_interest: {
        Args: { p_request_id: string }
        Returns: Database["public"]["Enums"]["request_interest_status"]
      }
      is_artisan_eligible_for_request: {
        Args: {
          p_artisan_id: string
          p_max_radius_meters?: number
          p_request_id: string
        }
        Returns: boolean
      }
      list_open_requests_for_artisan: {
        Args: { p_max_radius_meters?: number }
        Returns: {
          address: string
          budget: number | null
          category_id: string
          category_name: string
          category_slug: string
          created_at: string
          description: string
          distance_meters: number | null
          interest_status: Database["public"]["Enums"]["request_interest_status"] | null
          preferred_time: string | null
          request_id: string
          score: number
          urgency: Database["public"]["Enums"]["urgency_level"]
        }[]
      }
      list_request_interests: {
        Args: { p_request_id: string }
        Returns: {
          artisan_id: string
          average_rating: number
          city_lga: string | null
          completed_jobs: number
          created_at: string
          distance_meters: number | null
          first_name: string | null
          interest_id: string
          last_name: string | null
          profile_photo_url: string | null
          score: number
          state: string | null
        }[]
      }
      select_artisan: {
        Args: { p_artisan_id: string; p_request_id: string }
        Returns: Database["public"]["Enums"]["request_status"]
      }
      withdraw_interest: {
        Args: { p_request_id: string }
        Returns: Database["public"]["Enums"]["request_interest_status"]
      }
      confirm_job_completion: {
        Args: { p_request_id: string }
        Returns: string
      }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      generate_match_suggestions: {
        Args: {
          p_request_id: string
          p_max_radius_meters?: number
        }
        Returns: {
          artisan_id: string
          artisan_profile_id: string
          artisan_name: string
          category_name: string | null
          city_lga: string | null
          state: string | null
          availability: Database["public"]["Enums"]["availability"] | null
          average_rating: number
          completed_jobs: number
          distance_meters: number | null
          score: number
          category_score: number
          location_score: number
          availability_score: number
          rating_score: number
          completion_score: number
          response_score: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_approved_artisan: { Args: never; Returns: boolean }
    }
    Enums: {
      availability:
        | "full_time"
        | "part_time"
        | "weekends_only"
        | "flexible"
        | "on_demand"
      request_interest_status:
        | "pending"
        | "withdrawn"
        | "selected"
        | "declined"
        | "expired"
      request_status:
        | "submitted"
        | "matching"
        | "matched"
        | "confirmed"
        | "accepted"
        | "on_the_way"
        | "arrived"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      urgency_level: "emergency" | "urgent" | "normal" | "flexible"
      user_role: "customer" | "artisan" | "admin"
      user_status: "active" | "suspended" | "deleted"
      verification_status: "pending" | "approved" | "rejected" | "more_info"
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
      availability: [
        "full_time",
        "part_time",
        "weekends_only",
        "flexible",
        "on_demand",
      ],
      request_interest_status: [
        "pending",
        "withdrawn",
        "selected",
        "declined",
        "expired",
      ],
      request_status: [
        "submitted",
        "matching",
        "matched",
        "confirmed",
        "accepted",
        "on_the_way",
        "arrived",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      urgency_level: ["emergency", "urgent", "normal", "flexible"],
      user_role: ["customer", "artisan", "admin"],
      user_status: ["active", "suspended", "deleted"],
      verification_status: ["pending", "approved", "rejected", "more_info"],
    },
  },
} as const
