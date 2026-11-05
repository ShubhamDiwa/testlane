begin;
create or replace function public.community_remove_app(p_app uuid)
returns boolean language sql security definer set search_path = '' as $$
  with removed as (
    update public.community_apps
    set duplicate_archived_at = now()
    where id = p_app and owner = auth.uid() and duplicate_archived_at is null
    returning id
  )
  select exists(select 1 from removed);
$$;
revoke all on function public.community_remove_app(uuid) from public,anon,authenticated;
grant execute on function public.community_remove_app(uuid) to authenticated;
commit;
