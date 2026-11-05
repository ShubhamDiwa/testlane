begin;
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author uuid not null default auth.uid() references public.community_members(id),
  kind text not null check (kind in ('web-test', 'ui', 'code', 'fixed')),
  title text not null check (char_length(btrim(title)) between 5 and 120),
  body text not null check (char_length(btrim(body)) between 10 and 4000),
  test_url text,
  created_at timestamptz not null default now(),
  check ((kind = 'web-test' and test_url is not null and test_url ~ '^https?://[^[:space:]]+$' and length(test_url) <= 2048)
    or (kind <> 'web-test' and test_url is null))
);
create index community_posts_feed on public.community_posts (created_at desc, id);
create table public.community_post_comments (
  id uuid primary key default gen_random_uuid(),
  post uuid not null references public.community_posts(id) on delete cascade,
  author uuid not null default auth.uid() references public.community_members(id),
  body text not null check (char_length(btrim(body)) between 2 and 2000),
  created_at timestamptz not null default now()
);
create index community_post_comments_thread on public.community_post_comments (post, created_at, id);
create table public.community_post_votes (
  post uuid not null references public.community_posts(id) on delete cascade,
  member uuid not null default auth.uid() references public.community_members(id),
  primary key (post, member)
);

alter table public.community_posts enable row level security;
alter table public.community_post_comments enable row level security;
alter table public.community_post_votes enable row level security;
revoke all on public.community_posts, public.community_post_comments, public.community_post_votes from public, anon, authenticated;
grant select on public.community_posts, public.community_post_comments to anon, authenticated;
grant insert(kind,title,body,test_url) on public.community_posts to authenticated;
grant insert(post,body) on public.community_post_comments to authenticated;
grant select, delete on public.community_post_votes to authenticated;
grant insert(post) on public.community_post_votes to authenticated;

create policy read_posts on public.community_posts for select using (true);
create policy create_posts on public.community_posts for insert to authenticated with check (author = (select auth.uid()));
create policy read_post_comments on public.community_post_comments for select using (true);
create policy create_post_comments on public.community_post_comments for insert to authenticated with check (author = (select auth.uid()));
create policy read_own_votes on public.community_post_votes for select to authenticated using (member = (select auth.uid()));
create policy add_own_votes on public.community_post_votes for insert to authenticated with check (member = (select auth.uid()));
create policy remove_own_votes on public.community_post_votes for delete to authenticated using (member = (select auth.uid()));

create view public.community_post_feed as
select p.*, m.name as author_name,
  (select count(*) from public.community_post_comments c where c.post = p.id) as comment_count,
  (select count(*) from public.community_post_votes v where v.post = p.id) as vote_count
from public.community_posts p join public.community_members m on m.id = p.author;
revoke all on public.community_post_feed from public, anon, authenticated;
grant select on public.community_post_feed to anon, authenticated;
commit;
