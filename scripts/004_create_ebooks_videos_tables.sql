-- Create e-books table
create table if not exists public.ebooks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  author text,
  document_url text not null, -- URL to PDF or document
  thumbnail_url text,
  category text,
  estimated_read_minutes integer,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create educational videos table
create table if not exists public.educational_videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  youtube_url text not null,
  thumbnail_url text,
  duration_minutes integer,
  category text,
  is_published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create e-book reading progress table
create table if not exists public.ebook_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  ebook_id uuid references public.ebooks(id) on delete cascade,
  completed boolean default false,
  last_page integer default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, ebook_id)
);

-- Create video watch progress table
create table if not exists public.video_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  video_id uuid references public.educational_videos(id) on delete cascade,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, video_id)
);

-- Enable Row Level Security
alter table public.ebooks enable row level security;
alter table public.educational_videos enable row level security;
alter table public.ebook_progress enable row level security;
alter table public.video_progress enable row level security;

-- E-books policies (public read for published)
create policy "Anyone can view published ebooks"
  on public.ebooks for select
  using (is_published = true);

-- Videos policies (public read for published)
create policy "Anyone can view published videos"
  on public.educational_videos for select
  using (is_published = true);

-- E-book progress policies
create policy "Users can view their own ebook progress"
  on public.ebook_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ebook progress"
  on public.ebook_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own ebook progress"
  on public.ebook_progress for update
  using (auth.uid() = user_id);

-- Video progress policies
create policy "Users can view their own video progress"
  on public.video_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own video progress"
  on public.video_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own video progress"
  on public.video_progress for update
  using (auth.uid() = user_id);
