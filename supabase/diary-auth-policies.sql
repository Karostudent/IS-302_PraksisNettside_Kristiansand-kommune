-- Run this once in the Supabase SQL Editor after creating the diary Auth user.
alter table public.diary_entries enable row level security;

drop policy if exists "Anyone can read diary entries" on public.diary_entries;
drop policy if exists "Anyone can create diary entries" on public.diary_entries;
drop policy if exists "Anyone can update diary entries" on public.diary_entries;
drop policy if exists "Anyone can delete diary entries" on public.diary_entries;
drop policy if exists "Diary entries are publicly readable" on public.diary_entries;
drop policy if exists "Diary account can create entries" on public.diary_entries;
drop policy if exists "Diary account can update entries" on public.diary_entries;
drop policy if exists "Diary account can delete entries" on public.diary_entries;

revoke all on table public.diary_entries from anon, authenticated;
grant select on table public.diary_entries to anon, authenticated;
grant insert, update, delete on table public.diary_entries to authenticated;

create policy "Diary entries are publicly readable"
on public.diary_entries
for select
to anon, authenticated
using (true);

create policy "Diary account can create entries"
on public.diary_entries
for insert
to authenticated
with check ((select auth.jwt()->>'email') = 'dagbok@praksisnettside.no');

create policy "Diary account can update entries"
on public.diary_entries
for update
to authenticated
using ((select auth.jwt()->>'email') = 'dagbok@praksisnettside.no')
with check ((select auth.jwt()->>'email') = 'dagbok@praksisnettside.no');

create policy "Diary account can delete entries"
on public.diary_entries
for delete
to authenticated
using ((select auth.jwt()->>'email') = 'dagbok@praksisnettside.no');
