DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed user (idempotent)
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
      '{"name": "Admin Finova"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;
END $$;

-- Create timeline table
CREATE TABLE IF NOT EXISTS public.empresa_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id TEXT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  status TEXT NOT NULL CHECK (status IN ('concluido', 'aberto', 'nao_iniciado')) DEFAULT 'nao_iniciado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(empresa_id, ano, mes)
);

-- RLS Policies
ALTER TABLE public.empresa_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_select_timeline" ON public.empresa_timeline;
CREATE POLICY "authenticated_select_timeline" ON public.empresa_timeline
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_timeline" ON public.empresa_timeline;
CREATE POLICY "authenticated_insert_timeline" ON public.empresa_timeline
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_timeline" ON public.empresa_timeline;
CREATE POLICY "authenticated_update_timeline" ON public.empresa_timeline
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_timeline" ON public.empresa_timeline;
CREATE POLICY "authenticated_delete_timeline" ON public.empresa_timeline
  FOR DELETE TO authenticated USING (true);

-- Seed sample empresas if table is empty, to prevent blank states
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.empresas) THEN
    INSERT INTO public.empresas (id, nome, responsavel, atividade, fiscal, fechamento, regime_tributario) VALUES
      ('emp-1', 'Tech Solutions LTDA', 'João Silva', 'Desenvolvimento de Software', 'Verificada', 'Dia 05', 'Lucro Presumido'),
      ('emp-2', 'Comércio Varejista S.A.', 'Maria Fernandes', 'Venda de Eletrônicos', 'Pendente', 'Dia 10', 'Simples Nacional');
  END IF;
END $$;
