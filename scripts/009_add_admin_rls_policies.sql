-- Add RLS policies for admin users to manage ebooks and videos

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Admins can view all ebooks" on public.ebooks;
drop policy if exists "Admins can insert ebooks" on public.ebooks;
drop policy if exists "Admins can update ebooks" on public.ebooks;
drop policy if exists "Admins can delete ebooks" on public.ebooks;

drop policy if exists "Admins can view all videos" on public.educational_videos;
drop policy if exists "Admins can insert videos" on public.educational_videos;
drop policy if exists "Admins can update videos" on public.educational_videos;
drop policy if exists "Admins can delete videos" on public.educational_videos;

-- E-books admin policies
create policy "Admins can view all ebooks"
  on public.ebooks for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can insert ebooks"
  on public.ebooks for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can update ebooks"
  on public.ebooks for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can delete ebooks"
  on public.ebooks for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Educational videos admin policies
create policy "Admins can view all videos"
  on public.educational_videos for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can insert videos"
  on public.educational_videos for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can update videos"
  on public.educational_videos for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

create policy "Admins can delete videos"
  on public.educational_videos for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );
