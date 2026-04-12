CREATE OR REPLACE FUNCTION public.get_profile_id_by_name(p_name TEXT) RETURNS UUID AS $F$
DECLARE
  v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.profiles WHERE name ILIKE p_name LIMIT 1;
  IF v_id IS NULL THEN
    SELECT id INTO v_id FROM public.profiles WHERE split_part(name, ' ', 1) ILIKE split_part(p_name, ' ', 1) LIMIT 1;
  END IF;
  RETURN v_id;
END;
$F$ LANGUAGE plpgsql;

DO $BODY$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'empresas' AND column_name = 'responsavel' AND data_type = 'text'
  ) THEN
    ALTER TABLE public.empresas ALTER COLUMN responsavel DROP DEFAULT;
    ALTER TABLE public.empresas ALTER COLUMN responsavel DROP NOT NULL;

    ALTER TABLE public.empresas ALTER COLUMN responsavel TYPE UUID USING public.get_profile_id_by_name(responsavel);
    
    ALTER TABLE public.empresas ADD CONSTRAINT empresas_responsavel_fkey FOREIGN KEY (responsavel) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $BODY$;

DROP FUNCTION IF EXISTS public.get_profile_id_by_name(TEXT);
