export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          feedback: string | null
          id: string
          interaction_type: string
          metadata: Json | null
          organization_id: string | null
          prompt: string | null
          response: string | null
          ticket_id: string | null
          was_successful: boolean | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          organization_id?: string | null
          prompt?: string | null
          response?: string | null
          ticket_id?: string | null
          was_successful?: boolean | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          organization_id?: string | null
          prompt?: string | null
          response?: string | null
          ticket_id?: string | null
          was_successful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          ai_metadata: Json | null
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          search_vector: unknown | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_metadata?: Json | null
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          search_vector?: unknown | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_metadata?: Json | null
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          search_vector?: unknown | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_cards: {
        Row: {
          category: string | null
          context: string
          conversation_context: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          metadata: Json | null
          notes: string | null
          organization_id: string | null
          priority: string | null
          status: string | null
          suggested_response: string | null
          trigger: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          context: string
          conversation_context?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id?: string | null
          priority?: string | null
          status?: string | null
          suggested_response?: string | null
          trigger: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          context?: string
          conversation_context?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id?: string | null
          priority?: string | null
          status?: string | null
          suggested_response?: string | null
          trigger?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_cards_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_cards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_metadata: Json | null
          attachments: Json | null
          content: string
          created_at: string | null
          id: string
          intent: string | null
          is_ai_generated: boolean | null
          is_internal: boolean | null
          sender_id: string | null
          sentiment: string | null
          ticket_id: string | null
        }
        Insert: {
          ai_metadata?: Json | null
          attachments?: Json | null
          content: string
          created_at?: string | null
          id?: string
          intent?: string | null
          is_ai_generated?: boolean | null
          is_internal?: boolean | null
          sender_id?: string | null
          sentiment?: string | null
          ticket_id?: string | null
        }
        Update: {
          ai_metadata?: Json | null
          attachments?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          intent?: string | null
          is_ai_generated?: boolean | null
          is_internal?: boolean | null
          sender_id?: string | null
          sentiment?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          ai_settings: Json | null
          billing_email: string | null
          created_at: string | null
          domain: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          ai_settings?: Json | null
          billing_email?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          ai_settings?: Json | null
          billing_email?: string | null
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          ai_metadata: Json | null
          assignee_id: string | null
          category: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          priority: string
          resolved_at: string | null
          search_vector: unknown | null
          sentiment: string | null
          status: string
          subject: string
          ticket_number: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          ai_metadata?: Json | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          priority?: string
          resolved_at?: string | null
          search_vector?: unknown | null
          sentiment?: string | null
          status?: string
          subject: string
          ticket_number: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          ai_metadata?: Json | null
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          priority?: string
          resolved_at?: string | null
          search_vector?: unknown | null
          sentiment?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      training_feedback: {
        Row: {
          card_id: string | null
          created_at: string | null
          id: string
          is_approved: boolean
          metadata: Json | null
          notes: string | null
          organization_id: string | null
          review_time: number | null
          session_id: string | null
          trainer_id: string | null
          training_notes: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          id?: string
          is_approved: boolean
          metadata?: Json | null
          notes?: string | null
          organization_id?: string | null
          review_time?: number | null
          session_id?: string | null
          trainer_id?: string | null
          training_notes?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean
          metadata?: Json | null
          notes?: string | null
          organization_id?: string | null
          review_time?: number | null
          session_id?: string | null
          trainer_id?: string | null
          training_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_feedback_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "learning_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          cards_approved: number | null
          cards_rejected: number | null
          cards_reviewed: number | null
          created_at: string | null
          end_time: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          start_time: string | null
          status: string | null
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          cards_approved?: number | null
          cards_rejected?: number | null
          cards_reviewed?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          start_time?: string | null
          status?: string | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cards_approved?: number | null
          cards_rejected?: number | null
          cards_reviewed?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          start_time?: string | null
          status?: string | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          expertise: Json | null
          full_name: string | null
          id: string
          organization_id: string | null
          preferences: Json | null
          role: string
          settings: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          expertise?: Json | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          preferences?: Json | null
          role?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          expertise?: Json | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          preferences?: Json | null
          role?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      generate_ticket_number: {
        Args: {
          workspace_id: string
        }
        Returns: string
      }
      get_user_organization_id: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      is_workspace_member: {
        Args: {
          workspace_id_param: string
        }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
