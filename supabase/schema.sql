-- Run once in a new Supabase project's SQL editor. Never expose service-role keys.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null default 'customer' check (role in ('customer','admin')),
 created_at timestamptz not null default now()
);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id) values(new.id); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
-- Covers users created before running this setup.
insert into public.profiles(id) select id from auth.users on conflict do nothing;
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
alter table public.profiles enable row level security;
create policy profiles_read on public.profiles for select to authenticated using(id=(select auth.uid()) or public.is_admin());
-- No client write policy: role changes require the SQL editor or a trusted service.
create table public.test_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 app_name text not null check(char_length(app_name) between 1 and 100),
 package_name text not null check(char_length(package_name) between 3 and 200),
 test_url text not null check(test_url like 'https://play.google.com/apps/testing/%' and char_length(test_url)<=1000),
 contact_name text not null check(char_length(contact_name) between 1 and 100),
 contact_email text not null check(char_length(contact_email) between 3 and 200),
 description text not null check(char_length(description) between 15 and 3000),
 workflows text not null check(char_length(workflows) between 15 and 5000),
 countries text not null check(char_length(countries) between 1 and 300),
 android_version text not null,
 status text not null default 'requested' check(status in ('requested','setup','testing','review','complete','cancelled')),
 start_date date,
 created_at timestamptz not null default now()
);
create index requests_owner_idx on public.test_requests(user_id);
create index requests_created_idx on public.test_requests(created_at desc);
alter table public.test_requests enable row level security;
create policy requests_read on public.test_requests for select to authenticated using(user_id=(select auth.uid()) or public.is_admin());
create policy requests_create on public.test_requests for insert to authenticated with check(user_id=(select auth.uid()) and status='requested' and start_date is null);
create policy requests_admin_update on public.test_requests for update to authenticated using(public.is_admin()) with check(public.is_admin());
-- Explicit grants keep the browser API narrow, even with broader default privileges.
revoke all on public.profiles,public.test_requests from anon,authenticated;
grant select on public.profiles to authenticated;
grant select,insert on public.test_requests to authenticated;
grant update(status,start_date) on public.test_requests to authenticated;
-- Promote the operator after first sign-in, using their exact auth user UUID:
-- update public.profiles set role='admin' where id='YOUR_USER_UUID';
