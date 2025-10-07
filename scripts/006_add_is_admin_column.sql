-- Add is_admin column to profiles table if it doesn't exist
alter table public.profiles
add column if not exists is_admin boolean default false;
