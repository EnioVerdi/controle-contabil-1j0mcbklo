DO $$
BEGIN
  -- Add foreign key constraint to profiles to allow PostgREST to perform the join
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'empresa_observacoes_user_id_profiles_fk'
    AND table_schema = 'public'
    AND table_name = 'empresa_observacoes'
  ) THEN
    ALTER TABLE public.empresa_observacoes
      ADD CONSTRAINT empresa_observacoes_user_id_profiles_fk
      FOREIGN KEY (user_id) REFERENCES public.profiles(id)
      ON DELETE CASCADE;
  END IF;
END $$;
