begin;
alter table public.community_posts add column image_data text
  check (image_data is null or (
    octet_length(image_data) <= 1398140
    and image_data ~ '^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$'
  ));
grant insert(image_data) on public.community_posts to authenticated;

create or replace view public.community_post_feed as
select p.id, p.author, p.kind, p.title, p.body, p.test_url, p.created_at,
  m.name as author_name,
  (select count(*) from public.community_post_comments c where c.post = p.id) as comment_count,
  (select count(*) from public.community_post_votes v where v.post = p.id) as vote_count,
  p.image_data is not null as has_image
from public.community_posts p join public.community_members m on m.id = p.author;
commit;
