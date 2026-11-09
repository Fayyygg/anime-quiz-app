create table if not exists public.profiles (
  id bigint primary key,
  username text,
  first_name text,
  photo_url text,
  coins integer default 4320,
  total_wins integer default 0,
  games_played integer default 0,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone."
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on public.profiles for insert with check (true);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on public.profiles for update using (true);