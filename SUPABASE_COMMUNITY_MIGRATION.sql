-- Run this in Supabase SQL Editor if your database already exists.
-- It adds storage for the homepage "Join the community" signup form.

create table if not exists public.community_members (
  email      text primary key,
  source     text,
  created_at timestamptz not null default now()
);

alter table public.community_members enable row level security;

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
