create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default 'Игрок',
  coins integer not null default 0 check (coins >= 0),
  total_wins integer not null default 0 check (total_wins >= 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, insert on public.profiles to authenticated;

drop policy if exists "Players can read their own profile" on public.profiles;
create policy "Players can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Players can create their own profile" on public.profiles;
create policy "Players can create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create or replace function public.record_quiz_result(p_score integer)
returns setof public.profiles
language sql
security definer
set search_path = ''
as $$
  update public.profiles
  set coins = coins + least(greatest(coalesce(p_score, 0), 0), 10) * 100,
      total_wins = total_wins + least(greatest(coalesce(p_score, 0), 0), 10)
  where id = (select auth.uid())
  returning *;
$$;

revoke all on function public.record_quiz_result(integer) from public, anon;
grant execute on function public.record_quiz_result(integer) to authenticated;