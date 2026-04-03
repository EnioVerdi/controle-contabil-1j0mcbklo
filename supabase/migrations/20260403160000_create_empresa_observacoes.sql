DO $$
BEGIN
  -- Create table if not exists
  CREATE TABLE IF NOT EXISTS public.empresa_observacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id TEXT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    observacao TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Create Index
  CREATE INDEX IF NOT EXISTS empresa_observacoes_empresa_ano_idx ON public.empresa_observacoes(empresa_id, ano);
END $$;

-- Enable RLS
ALTER TABLE public.empresa_observacoes ENABLE ROW LEVEL SECURITY;

-- Create Policies
DROP POLICY IF EXISTS "role_select_observacoes" ON public.empresa_observacoes;
CREATE POLICY "role_select_observacoes" ON public.empresa_observacoes
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "role_insert_observacoes" ON public.empresa_observacoes;
CREATE POLICY "role_insert_observacoes" ON public.empresa_observacoes
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])
    )
  );

DROP POLICY IF EXISTS "role_update_observacoes" ON public.empresa_observacoes;
CREATE POLICY "role_update_observacoes" ON public.empresa_observacoes
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])
    )
  );

DROP POLICY IF EXISTS "role_delete_observacoes" ON public.empresa_observacoes;
CREATE POLICY "role_delete_observacoes" ON public.empresa_observacoes
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])
    )
  );
