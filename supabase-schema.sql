-- ════════════════════════════════════════════════════
--  Block by Block — Supabase Schema
--  Run in: supabase.com → your project → SQL Editor
-- ════════════════════════════════════════════════════

-- PROFILES table
create table public.profiles (
  id                 uuid references auth.users on delete cascade primary key,
  parent_name        text,
  child_username     text unique not null,
  email              text not null,
  plan               text not null default 'free',
  xp                 integer not null default 0,
  stripe_customer_id text,
  subscription_id    text,
  plan_expires_at    timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- MOOD LOGS table (mood check-ins — never journal text)
create table public.mood_logs (
  id         bigserial primary key,
  user_id    uuid references public.profiles(id) on delete cascade,
  emoji      text not null,
  label      text not null,
  date       text not null,
  created_at timestamptz not null default now()
);

-- ROW LEVEL SECURITY
alter table public.profiles  enable row level security;
alter table public.mood_logs enable row level security;

-- Profiles: users see only their own row
create policy "Own profile" on public.profiles
  for all using (auth.uid() = id);

-- Mood logs: users see only their own logs
create policy "Own mood logs" on public.mood_logs
  for all using (auth.uid() = user_id);

-- Service role bypass (for server-side operations)
create policy "Service role profiles"  on public.profiles  for all using (auth.role() = 'service_role');
create policy "Service role mood logs" on public.mood_logs for all using (auth.role() = 'service_role');

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Helper: check if user has premium
create or replace function public.is_premium(uid uuid)
returns boolean as $$
  select plan in ('premium','school')
  from public.profiles
  where id = uid
  and (plan_expires_at is null or plan_expires_at > now());
$$ language sql security definer;


-- COMMUNITY MEMBERS table (newsletter/community signup emails)
create table if not exists public.community_members (
  email      text primary key,
  source     text,
  created_at timestamptz not null default now()
);

alter table public.community_members enable row level security;

-- Service role only; public users submit through the server endpoint, not direct browser access.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'community_members'
      and policyname = 'Service role community members'
  ) then
    create policy "Service role community members"
      on public.community_members for all
      using (auth.role() = 'service_role');
  end if;
end $$;
