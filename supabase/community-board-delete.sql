begin;
grant delete on public.community_posts to authenticated;
create policy delete_own_posts on public.community_posts for delete to authenticated
  using (author = (select auth.uid()));
commit;
