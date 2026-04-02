DO $$
DECLARE
  v_admin_id uuid;
  v_admin_email text := 'eniol.verdi@gmail.com';
BEGIN
  -- Update existing profiles to ensure user_id is populated from id
  UPDATE public.profiles
  SET user_id = id
  WHERE user_id IS NULL AND id IN (SELECT id FROM auth.users);

  -- Ensure the current user has an admin profile if missing
  SELECT id INTO v_admin_id FROM auth.users WHERE email = v_admin_email LIMIT 1;

  IF v_admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, user_id, email, name, role_id, role)
    VALUES (
      v_admin_id,
      v_admin_id,
      v_admin_email,
      COALESCE((SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = v_admin_id), 'Admin'),
      'admin',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        role_id = 'admin',
        role = 'admin';
  END IF;
END $$;
