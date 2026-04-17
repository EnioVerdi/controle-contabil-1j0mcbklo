// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      empresa_observacoes: {
        Row: {
          ano: number
          created_at: string
          empresa_id: string
          id: string
          observacao: string
          user_id: string
        }
        Insert: {
          ano: number
          created_at?: string
          empresa_id: string
          id?: string
          observacao: string
          user_id: string
        }
        Update: {
          ano?: number
          created_at?: string
          empresa_id?: string
          id?: string
          observacao?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_observacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_observacoes_user_id_profiles_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_timeline: {
        Row: {
          ano: number
          created_at: string
          data_conclusao: string | null
          empresa_id: string
          id: string
          mes: number
          status: string
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          data_conclusao?: string | null
          empresa_id: string
          id?: string
          mes: number
          status?: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          data_conclusao?: string | null
          empresa_id?: string
          id?: string
          mes?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_timeline_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
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
          responsavel: string | null
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
          responsavel?: string | null
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
          responsavel?: string | null
          ultima_verificacao?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
          role_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
        }
        Insert: {
          description?: string | null
          id: string
        }
        Update: {
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      tempo_orcado_empresas: {
        Row: {
          ano: number
          created_at: string
          empresa_id: string
          id: string
          mes: number
          tempo_orcado: number
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          empresa_id: string
          id?: string
          mes: number
          tempo_orcado?: number
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          empresa_id?: string
          id?: string
          mes?: number
          tempo_orcado?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tempo_orcado_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: { Args: { p_ano: number }; Returns: Json }
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


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   actor_id: uuid (nullable)
//   action: text (not null)
//   entity_type: text (not null)
//   entity_id: uuid (nullable)
//   details: jsonb (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: empresa_observacoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: text (not null)
//   ano: integer (not null)
//   user_id: uuid (not null)
//   observacao: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: empresa_timeline
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: text (not null)
//   ano: integer (not null)
//   mes: integer (not null)
//   status: text (not null, default: 'nao_iniciado'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   data_conclusao: timestamp with time zone (nullable)
// Table: empresas
//   id: text (not null)
//   user_id: uuid (nullable)
//   nome: text (not null)
//   logo: text (nullable)
//   responsavel: uuid (nullable)
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
// Table: profiles
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   name: text (not null)
//   email: text (not null)
//   role: text (nullable, default: 'user'::text)
//   status: text (nullable, default: 'Ativo'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   role_id: text (nullable)
// Table: roles
//   id: text (not null)
//   description: text (nullable)
// Table: tempo_orcado_empresas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: text (not null)
//   mes: integer (not null)
//   ano: integer (not null)
//   tempo_orcado: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: audit_logs
//   FOREIGN KEY audit_logs_actor_id_fkey: FOREIGN KEY (actor_id) REFERENCES auth.users(id) ON DELETE SET NULL
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
// Table: empresa_observacoes
//   FOREIGN KEY empresa_observacoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY empresa_observacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY empresa_observacoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   FOREIGN KEY empresa_observacoes_user_id_profiles_fk: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: empresa_timeline
//   UNIQUE empresa_timeline_empresa_id_ano_mes_key: UNIQUE (empresa_id, ano, mes)
//   FOREIGN KEY empresa_timeline_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK empresa_timeline_mes_check: CHECK (((mes >= 1) AND (mes <= 12)))
//   PRIMARY KEY empresa_timeline_pkey: PRIMARY KEY (id)
//   CHECK empresa_timeline_status_check: CHECK ((status = ANY (ARRAY['concluido'::text, 'aberto'::text, 'nao_iniciado'::text])))
// Table: empresas
//   PRIMARY KEY empresas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY empresas_responsavel_fkey: FOREIGN KEY (responsavel) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY empresas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: profiles
//   UNIQUE profiles_email_key: UNIQUE (email)
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   FOREIGN KEY profiles_role_id_fkey: FOREIGN KEY (role_id) REFERENCES roles(id)
//   FOREIGN KEY profiles_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: roles
//   PRIMARY KEY roles_pkey: PRIMARY KEY (id)
// Table: tempo_orcado_empresas
//   FOREIGN KEY tempo_orcado_empresas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE tempo_orcado_empresas_empresa_mes_ano_key: UNIQUE (empresa_id, mes, ano)
//   CHECK tempo_orcado_empresas_mes_check: CHECK (((mes >= 1) AND (mes <= 12)))
//   PRIMARY KEY tempo_orcado_empresas_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: audit_logs
//   Policy "Admins can insert audit logs" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND ((profiles.role_id = 'admin'::text) OR (profiles.role = 'admin'::text)))))
//   Policy "Admins can view audit logs" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND ((profiles.role_id = 'admin'::text) OR (profiles.role = 'admin'::text)))))
// Table: empresa_observacoes
//   Policy "role_delete_observacoes" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_insert_observacoes" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_select_observacoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "role_update_observacoes" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
// Table: empresa_timeline
//   Policy "role_delete_timeline" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_insert_timeline" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_select_timeline" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "role_update_timeline" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//     WITH CHECK: true
// Table: empresas
//   Policy "role_delete_empresas" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_insert_empresas" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_select_empresas" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "role_update_empresas" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//     WITH CHECK: true
// Table: profiles
//   Policy "profiles_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role_id = 'admin'::text))))
//   Policy "profiles_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "profiles_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "profiles_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role_id = 'admin'::text)))))
//     WITH CHECK: true
// Table: tempo_orcado_empresas
//   Policy "role_delete_tempo_orcado" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_insert_tempo_orcado" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))
//   Policy "role_select_tempo_orcado" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "role_update_tempo_orcado" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))))

// --- DATABASE FUNCTIONS ---
// FUNCTION get_dashboard_stats(integer)
//   CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_ano integer)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_total_empresas INT;
//     v_tarefas_ano_aberto INT;
//     v_tarefas_ano_concluido INT;
//     v_tarefas_ano_total INT;
//     v_tarefas_global_pendente INT;
//     v_tarefas_global_aberto INT;
//     v_tarefas_global_concluido INT;
//     v_tarefas_global_total INT;
//     v_chart_data jsonb;
//     v_categories_data jsonb;
//     v_top_empresas jsonb;
//   BEGIN
//     -- Total empresas
//     SELECT count(*) INTO v_total_empresas FROM public.empresas;
//   
//     -- Tarefas ano
//     SELECT
//       count(*) FILTER (WHERE status = 'aberto'),
//       count(*) FILTER (WHERE status = 'concluido'),
//       count(*)
//     INTO v_tarefas_ano_aberto, v_tarefas_ano_concluido, v_tarefas_ano_total
//     FROM public.empresa_timeline
//     WHERE ano = p_ano;
//   
//     -- Tarefas global
//     SELECT
//       count(*) FILTER (WHERE status = 'nao_iniciado'),
//       count(*) FILTER (WHERE status = 'aberto'),
//       count(*) FILTER (WHERE status = 'concluido'),
//       count(*)
//     INTO v_tarefas_global_pendente, v_tarefas_global_aberto, v_tarefas_global_concluido, v_tarefas_global_total
//     FROM public.empresa_timeline;
//   
//     -- Chart data (global)
//     WITH months AS (
//       SELECT generate_series(1, 12) AS mes,
//              (ARRAY['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'])[generate_series(1,12)] as month_name
//     ),
//     monthly_stats AS (
//       SELECT
//         mes,
//         count(*) FILTER (WHERE status = 'concluido') as concluido,
//         count(*) FILTER (WHERE status = 'aberto') as aberto,
//         count(*) FILTER (WHERE status = 'nao_iniciado') as pendente
//       FROM public.empresa_timeline
//       GROUP BY mes
//     )
//     SELECT jsonb_agg(
//       jsonb_build_object(
//         'day', m.month_name,
//         'concluido', COALESCE(s.concluido, 0),
//         'aberto', COALESCE(s.aberto, 0),
//         'pendente', COALESCE(s.pendente, 0),
//         'total', COALESCE(s.concluido, 0) + COALESCE(s.aberto, 0) + COALESCE(s.pendente, 0)
//       ) ORDER BY m.mes
//     ) INTO v_chart_data
//     FROM months m
//     LEFT JOIN monthly_stats s ON m.mes = s.mes;
//   
//     -- Categories (by regime_tributario)
//     WITH regimes AS (
//       SELECT unnest(ARRAY['Lucro Real Mensal', 'Lucro Real Trimestral', 'Lucro Presumido', 'Simples Nacional', 'Simples Nacional Hibrido']) AS regime
//     ),
//     emp_regimes AS (
//       SELECT
//         CASE
//           WHEN regime_tributario IN ('Simples Nacional Hibrido', 'Simples Nacional Híbrido') THEN 'Simples Nacional Hibrido'
//           ELSE regime_tributario
//         END as rt
//       FROM public.empresas
//     ),
//     regime_counts AS (
//       SELECT rt, count(*) as val
//       FROM emp_regimes
//       GROUP BY rt
//     )
//     SELECT jsonb_agg(
//       jsonb_build_object(
//         'name', CASE WHEN r.regime = 'Simples Nacional Hibrido' THEN 'Simples Nacional Híbrido' ELSE r.regime END,
//         'value', COALESCE(c.val, 0),
//         'percent', CASE WHEN v_total_empresas > 0 THEN ROUND((COALESCE(c.val, 0)::numeric / v_total_empresas) * 100) ELSE 0 END
//       ) ORDER BY COALESCE(c.val, 0) DESC
//     ) INTO v_categories_data
//     FROM regimes r
//     LEFT JOIN regime_counts c ON r.regime = c.rt;
//   
//     -- Top Empresas
//     SELECT jsonb_agg(t) INTO v_top_empresas
//     FROM (
//       SELECT
//         e.id,
//         e.nome,
//         count(et.id) FILTER (WHERE et.status = 'concluido') as concluidas,
//         count(et.id) FILTER (WHERE et.status = 'aberto') as aberto,
//         count(et.id) FILTER (WHERE et.status = 'nao_iniciado') as pendentes,
//         CASE
//           WHEN count(et.id) > 0 THEN ROUND((count(et.id) FILTER (WHERE et.status = 'concluido')::numeric / count(et.id)) * 100)
//           ELSE 0
//         END as progresso
//       FROM public.empresas e
//       LEFT JOIN public.empresa_timeline et ON e.id = et.empresa_id AND et.ano = p_ano
//       GROUP BY e.id, e.nome
//       ORDER BY count(et.id) FILTER (WHERE et.status = 'concluido') DESC, e.nome ASC
//       LIMIT 100
//     ) t;
//   
//     RETURN jsonb_build_object(
//       'totalEmpresas', v_total_empresas,
//       'tarefasAnoAberto', COALESCE(v_tarefas_ano_aberto, 0),
//       'tarefasAnoConcluido', COALESCE(v_tarefas_ano_concluido, 0),
//       'tarefasAnoTotal', COALESCE(v_tarefas_ano_total, 0),
//       'tarefasGlobalPendente', COALESCE(v_tarefas_global_pendente, 0),
//       'tarefasGlobalAberto', COALESCE(v_tarefas_global_aberto, 0),
//       'tarefasGlobalConcluido', COALESCE(v_tarefas_global_concluido, 0),
//       'tarefasGlobalTotal', COALESCE(v_tarefas_global_total, 0),
//       'chartData', COALESCE(v_chart_data, '[]'::jsonb),
//       'categoriesData', COALESCE(v_categories_data, '[]'::jsonb),
//       'topEmpresasData', COALESCE(v_top_empresas, '[]'::jsonb)
//     );
//   END;
//   $function$
//   
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, user_id, email, name, role, status)
//     VALUES (
//       NEW.id,
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       'user',
//       'Ativo'
//     )
//     ON CONFLICT (id) DO UPDATE SET
//       user_id = EXCLUDED.user_id,
//       email = EXCLUDED.email,
//       name = EXCLUDED.name;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION set_current_timestamp_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: profiles
//   set_profiles_updated_at: CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at()
// Table: tempo_orcado_empresas
//   set_tempo_orcado_updated_at: CREATE TRIGGER set_tempo_orcado_updated_at BEFORE UPDATE ON public.tempo_orcado_empresas FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at()

// --- INDEXES ---
// Table: empresa_observacoes
//   CREATE INDEX empresa_observacoes_empresa_ano_idx ON public.empresa_observacoes USING btree (empresa_id, ano)
// Table: empresa_timeline
//   CREATE UNIQUE INDEX empresa_timeline_empresa_id_ano_mes_key ON public.empresa_timeline USING btree (empresa_id, ano, mes)
// Table: profiles
//   CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)
// Table: tempo_orcado_empresas
//   CREATE UNIQUE INDEX tempo_orcado_empresas_empresa_mes_ano_key ON public.tempo_orcado_empresas USING btree (empresa_id, mes, ano)

