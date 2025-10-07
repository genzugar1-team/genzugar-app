-- Create admin user account
-- Email: genzugar1@gmail.com
-- Password: @genzugar12

-- First, ensure the is_admin column exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create a function to create admin user if not exists
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'genzugar1@gmail.com';

  -- If user exists, just update their profile
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, is_admin)
    VALUES (admin_user_id, 'Admin Gen-Zugar', true)
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true, full_name = 'Admin Gen-Zugar';
    
    RAISE NOTICE 'Admin user profile updated for existing user';
  ELSE
    RAISE NOTICE 'Please sign up with email: genzugar1@gmail.com and password: @genzugar12, then run this script again';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_admin_user();

-- Drop the function after use
DROP FUNCTION create_admin_user();
