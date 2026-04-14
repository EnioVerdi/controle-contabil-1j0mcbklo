CREATE TABLE IF NOT EXISTS public.tempo_orcado_empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id TEXT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    ano INTEGER NOT NULL,
    tempo_orcado NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $DO$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tempo_orcado_empresas_empresa_mes_ano_key'
  ) THEN
    ALTER TABLE public.tempo_orcado_empresas ADD CONSTRAINT tempo_orcado_empresas_empresa_mes_ano_key UNIQUE (empresa_id, mes, ano);
  END IF;
END $DO$;

ALTER TABLE public.tempo_orcado_empresas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "role_select_tempo_orcado" ON public.tempo_orcado_empresas;
CREATE POLICY "role_select_tempo_orcado" ON public.tempo_orcado_empresas
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "role_insert_tempo_orcado" ON public.tempo_orcado_empresas;
CREATE POLICY "role_insert_tempo_orcado" ON public.tempo_orcado_empresas
    FOR INSERT TO authenticated WITH CHECK (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))));

DROP POLICY IF EXISTS "role_update_tempo_orcado" ON public.tempo_orcado_empresas;
CREATE POLICY "role_update_tempo_orcado" ON public.tempo_orcado_empresas
    FOR UPDATE TO authenticated USING (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))));

DROP POLICY IF EXISTS "role_delete_tempo_orcado" ON public.tempo_orcado_empresas;
CREATE POLICY "role_delete_tempo_orcado" ON public.tempo_orcado_empresas
    FOR DELETE TO authenticated USING (EXISTS ( SELECT 1 FROM profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = ANY (ARRAY['admin'::text, 'contador'::text])))));

DROP TRIGGER IF EXISTS set_tempo_orcado_updated_at ON public.tempo_orcado_empresas;
CREATE TRIGGER set_tempo_orcado_updated_at 
    BEFORE UPDATE ON public.tempo_orcado_empresas 
    FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();
