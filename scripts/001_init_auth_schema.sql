-- Roles enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'pasien');
  end if;
end $$;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text,
  email text,
  role public.user_role not null default 'pasien',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- Admins can read every profile (needed for the patient dropdown)
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Resep table
create table if not exists public.resep (
  id uuid primary key default gen_random_uuid(),
  pasien_id uuid not null references public.profiles(id) on delete cascade,
  nama_obat text not null,
  dosis text not null,
  harga integer not null default 0,
  dokter text not null,
  dibuat_oleh uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.resep enable row level security;

-- Patients can read only their own prescriptions
drop policy if exists "resep_select_own" on public.resep;
create policy "resep_select_own" on public.resep
  for select using (auth.uid() = pasien_id);

-- Admins can read all prescriptions
drop policy if exists "resep_select_admin" on public.resep;
create policy "resep_select_admin" on public.resep
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins can insert prescriptions
drop policy if exists "resep_insert_admin" on public.resep;
create policy "resep_insert_admin" on public.resep
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins can delete prescriptions
drop policy if exists "resep_delete_admin" on public.resep;
create policy "resep_delete_admin" on public.resep
  for delete using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile row on signup (always role 'pasien' from public sign-up)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nama, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama', null),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'pasien')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
