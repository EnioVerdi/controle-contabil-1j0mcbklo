-- Create empresas table
CREATE TABLE IF NOT EXISTS public.empresas (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    logo TEXT,
    responsavel TEXT NOT NULL,
    atividade TEXT NOT NULL,
    fechamento TEXT,
    fiscal TEXT NOT NULL DEFAULT 'Pendente',
    ultima_verificacao TEXT,
    regime_tributario TEXT,
    novo_responsavel TEXT,
    regime_folha TEXT,
    contabilizacao_folha TEXT,
    depreciacao BOOLEAN DEFAULT false,
    extratos BOOLEAN DEFAULT false,
    parcelamentos BOOLEAN DEFAULT false,
    distribuicao_lucro BOOLEAN DEFAULT false,
    periodo_verificado TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "authenticated_select" ON public.empresas;
CREATE POLICY "authenticated_select" ON public.empresas
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert" ON public.empresas;
CREATE POLICY "authenticated_insert" ON public.empresas
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update" ON public.empresas;
CREATE POLICY "authenticated_update" ON public.empresas
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete" ON public.empresas;
CREATE POLICY "authenticated_delete" ON public.empresas
  FOR DELETE TO authenticated USING (true);

-- Seed Auth User
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'eniol.verdi@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'eniol.verdi@gmail.com',
      crypt('securepassword123', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;
END $$;

-- Seed initial data for empresas
INSERT INTO public.empresas (id, nome, logo, responsavel, atividade, fechamento, fiscal, ultima_verificacao, regime_tributario, regime_folha, contabilizacao_folha, depreciacao, extratos, parcelamentos, distribuicao_lucro, periodo_verificado, observacoes) VALUES
('EMP001', 'TechCorp Solutions', 'https://img.usecurling.com/i?q=technology&shape=fill&color=blue', 'Ana Silva', 'Tecnologia', 'Dia 05', 'Verificada', '10/05/2024', 'Lucro Presumido', 'Desoneração', 'Sim', true, true, false, true, 'Abril/2024', 'Tudo ok.'),
('EMP002', 'Global Logistics', 'https://img.usecurling.com/i?q=logistics&shape=fill&color=orange', 'Carlos Mendes', 'Logística', 'Dia 10', 'Pendente', '08/05/2024', 'Simples Nacional', 'Normal', 'Não', false, false, true, false, 'Março/2024', 'Aguardando extratos.'),
('EMP003', 'Green Energy', 'https://img.usecurling.com/i?q=energy&shape=fill&color=green', 'Mariana Costa', 'Energia', 'Dia 15', 'Verificada', '12/05/2024', 'Lucro Real', 'Desoneração', 'Sim', true, true, false, true, 'Abril/2024', '')
ON CONFLICT (id) DO NOTHING;
