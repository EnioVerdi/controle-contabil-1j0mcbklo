CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  description TEXT
);

INSERT INTO public.roles (id, description) VALUES
  ('admin', 'Admin (acesso total)'),
  ('contador', 'Contador (acesso a empresas, tarefas, timeline e análises)'),
  ('gerente', 'Gerente (acesso a dashboard e relatórios)'),
  ('consultor', 'Consultor (apenas leitura)')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_id TEXT REFERENCES public.roles(id);

UPDATE public.profiles SET role_id = LOWER(role) WHERE role IS NOT NULL AND role_id IS NULL;
UPDATE public.profiles SET role_id = 'consultor' WHERE role_id IS NULL;

-- Admin user initialization
UPDATE public.profiles SET role_id = 'admin' WHERE email = 'eniol.verdi@gmail.com';

-- Implement RBAC using RLS
DROP POLICY IF EXISTS "authenticated_delete" ON public.empresas;
DROP POLICY IF EXISTS "authenticated_insert" ON public.empresas;
DROP POLICY IF EXISTS "authenticated_select" ON public.empresas;
DROP POLICY IF EXISTS "authenticated_update" ON public.empresas;

CREATE POLICY "role_select_empresas" ON public.empresas FOR SELECT TO authenticated USING (true);

CREATE POLICY "role_insert_empresas" ON public.empresas FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role_id IN ('admin', 'contador'))
);

CREATE POLICY "role_update_empresas" ON public.empresas FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role_id IN ('admin', 'contador'))
) WITH CHECK (true);

CREATE POLICY "role_delete_empresas" ON public.empresas FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role_id IN ('admin', 'contador'))
);

-- Timeline RLS
DROP POLICY IF EXISTS "authenticated_delete_timeline" ON public.empresa_timeline;
DROP POLICY IF EXISTS "authenticated_insert_timeline" ON public.empresa_timeline;
DROP POLICY IF EXISTS "authenticated_select_timeline" ON public.empresa_timeline;
DROP POLICY IF EXISTS "authenticated_update_timeline" ON public.empresa_timeline;

CREATE POLICY "role_select_timeline" ON public.empresa_timeline FOR SELECT TO authenticated USING (true);

CREATE POLICY "role_insert_timeline" ON public.empresa_timeline FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role_id IN ('admin', 'contador'))
);

CREATE POLICY "role_update_timeline" ON public.empresa_timeline FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role_id IN ('admin', 'contador'))
) WITH CHECK (true);

CREATE POLICY "role_delete_timeline" ON public.empresa_timeline FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role_id IN ('admin', 'contador'))
);

-- Profiles RLS
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 'admin')
) WITH CHECK (true);

CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role_id = 'admin')
);
