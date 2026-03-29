// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      empresa_timeline: {
        Row: {
          ano: number
          created_at: string
          empresa_id: string
          id: string
          mes: number
          status: string
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          empresa_id: string
          id?: string
          mes: number
          status?: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          empresa_id?: string
          id?: string
          mes?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'empresa_timeline_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      empresas: {
        Row: {
          atividade: string
          contabilizacao_folha: string | null
          created_at: string
          depreciacao: boolean | null
          distribuicao_lucro: boolean | null
          extratos: boolean | null
          fechamento: string | null
          fiscal: string
          id: string
          logo: string | null
          nome: string
          novo_responsavel: string | null
          observacoes: string | null
          parcelamentos: boolean | null
          periodo_verificado: string | null
          receita_financeira: boolean | null
          regime_folha: string | null
          regime_tributario: string | null
          responsavel: string
          ultima_verificacao: string | null
          user_id: string | null
        }
        Insert: {
          atividade: string
          contabilizacao_folha?: string | null
          created_at?: string
          depreciacao?: boolean | null
          distribuicao_lucro?: boolean | null
          extratos?: boolean | null
          fechamento?: string | null
          fiscal?: string
          id: string
          logo?: string | null
          nome: string
          novo_responsavel?: string | null
          observacoes?: string | null
          parcelamentos?: boolean | null
          periodo_verificado?: string | null
          receita_financeira?: boolean | null
          regime_folha?: string | null
          regime_tributario?: string | null
          responsavel: string
          ultima_verificacao?: string | null
          user_id?: string | null
        }
        Update: {
          atividade?: string
          contabilizacao_folha?: string | null
          created_at?: string
          depreciacao?: boolean | null
          distribuicao_lucro?: boolean | null
          extratos?: boolean | null
          fechamento?: string | null
          fiscal?: string
          id?: string
          logo?: string | null
          nome?: string
          novo_responsavel?: string | null
          observacoes?: string | null
          parcelamentos?: boolean | null
          periodo_verificado?: string | null
          receita_financeira?: boolean | null
          regime_folha?: string | null
          regime_tributario?: string | null
          responsavel?: string
          ultima_verificacao?: string | null
          user_id?: string | null
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: empresa_timeline
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: text (not null)
//   ano: integer (not null)
//   mes: integer (not null)
//   status: text (not null, default: 'nao_iniciado'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: empresas
//   id: text (not null)
//   user_id: uuid (nullable)
//   nome: text (not null)
//   logo: text (nullable)
//   responsavel: text (not null)
//   atividade: text (not null)
//   fechamento: text (nullable)
//   fiscal: text (not null, default: 'Pendente'::text)
//   ultima_verificacao: text (nullable)
//   regime_tributario: text (nullable)
//   novo_responsavel: text (nullable)
//   regime_folha: text (nullable)
//   contabilizacao_folha: text (nullable)
//   depreciacao: boolean (nullable, default: false)
//   extratos: boolean (nullable, default: false)
//   parcelamentos: boolean (nullable, default: false)
//   distribuicao_lucro: boolean (nullable, default: false)
//   periodo_verificado: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   receita_financeira: boolean (nullable, default: false)

// --- CONSTRAINTS ---
// Table: empresa_timeline
//   UNIQUE empresa_timeline_empresa_id_ano_mes_key: UNIQUE (empresa_id, ano, mes)
//   FOREIGN KEY empresa_timeline_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK empresa_timeline_mes_check: CHECK (((mes >= 1) AND (mes <= 12)))
//   PRIMARY KEY empresa_timeline_pkey: PRIMARY KEY (id)
//   CHECK empresa_timeline_status_check: CHECK ((status = ANY (ARRAY['concluido'::text, 'aberto'::text, 'nao_iniciado'::text])))
// Table: empresas
//   PRIMARY KEY empresas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY empresas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: empresa_timeline
//   Policy "authenticated_delete_timeline" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert_timeline" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_timeline" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update_timeline" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: empresas
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- INDEXES ---
// Table: empresa_timeline
//   CREATE UNIQUE INDEX empresa_timeline_empresa_id_ano_mes_key ON public.empresa_timeline USING btree (empresa_id, ano, mes)
