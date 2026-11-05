begin;
create function public.community_signup_count()
returns bigint language sql stable security definer set search_path = '' as $$
  select count(*) from auth.users;
$$;
revoke all on function public.community_signup_count() from public;
grant execute on function public.community_signup_count() to anon, authenticated;

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  app uuid not null references public.community_apps on delete cascade,
  author uuid not null default auth.uid() references public.community_members,
  body text not null check (char_length(trim(body)) between 2 and 1000),
  created_at timestamptz not null default now()
);
create index community_comments_app_recent on public.community_comments(app, created_at desc, id);
alter table public.community_comments enable row level security;
revoke all on public.community_comments from public, anon, authenticated;
grant select on public.community_comments to anon, authenticated;
grant insert(app, body) on public.community_comments to authenticated;
create policy comments_read_visible_apps on public.community_comments for select using (
  exists (select 1 from public.community_apps a where a.id = app)
);
create policy members_comment_on_visible_apps on public.community_comments for insert to authenticated with check (
  author = (select auth.uid())
  and exists (select 1 from public.community_members m where m.id = author)
  and exists (select 1 from public.community_apps a where a.id = app)
);
commit;
