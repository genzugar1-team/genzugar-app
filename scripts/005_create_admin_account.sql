-- Create admin user account
-- Note: This creates the user in auth.users and sets up the profile
-- Password: @genzugar12

-- Insert into auth.users (Supabase will handle password hashing)
-- This is a placeholder - you'll need to sign up through the UI first with:
-- Email: genzugar1@gmail.com
-- Password: @genzugar12
-- Then run this script to make the account an admin:

-- Update the profile to set is_admin = true
-- Replace the email with the actual admin email
update public.profiles
set is_admin = true
where id = (
  select id from auth.users
  where email = 'genzugar1@gmail.com'
);

-- If the profile doesn't exist yet, you can create it manually:
-- (Only run this if the user has signed up but profile wasn't created)
insert into public.profiles (id, full_name, is_admin)
select id, 'Admin Gen-Zugar', true
from auth.users
where email = 'genzugar1@gmail.com'
on conflict (id) do update
set is_admin = true;
