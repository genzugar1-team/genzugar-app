-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create learning modules table
create table if not exists public.learning_modules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  learning_objectives text[] not null,
  estimated_duration_minutes integer not null,
  module_order integer not null,
  thumbnail_url text,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create module content table (e-books, videos, games, quizzes)
create table if not exists public.module_content (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references public.learning_modules(id) on delete cascade,
  content_type text not null check (content_type in ('ebook', 'video', 'game', 'quiz')),
  title text not null,
  content_url text,
  content_data jsonb, -- For storing quiz questions, game config, etc.
  content_order integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create user progress table
create table if not exists public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  module_id uuid references public.learning_modules(id) on delete cascade,
  content_id uuid references public.module_content(id) on delete cascade,
  completed boolean default false,
  score numeric(5,2), -- For quizzes
  time_spent_minutes integer,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, content_id)
);

-- Create glossary table
create table if not exists public.glossary (
  id uuid primary key default uuid_generate_v4(),
  term text not null unique,
  definition text not null,
  category text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create BMI history table
create table if not exists public.bmi_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  height_cm numeric(5,2) not null,
  weight_kg numeric(5,2) not null,
  bmi_value numeric(5,2) not null,
  bmi_category text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.learning_modules enable row level security;
alter table public.module_content enable row level security;
alter table public.user_progress enable row level security;
alter table public.glossary enable row level security;
alter table public.bmi_history enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Learning modules policies (public read, admin write)
create policy "Anyone can view published modules"
  on public.learning_modules for select
  using (is_published = true);

-- Module content policies (public read for published modules)
create policy "Anyone can view content of published modules"
  on public.module_content for select
  using (
    exists (
      select 1 from public.learning_modules
      where id = module_content.module_id
      and is_published = true
    )
  );

-- User progress policies
create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Glossary policies (public read)
create policy "Anyone can view glossary"
  on public.glossary for select
  using (true);

-- BMI history policies
create policy "Users can view their own BMI history"
  on public.bmi_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own BMI history"
  on public.bmi_history for insert
  with check (auth.uid() = user_id);
