begin;
lock table public.community_apps in share row exclusive mode;
alter table public.community_apps add column duplicate_archived_at timestamptz;

with ranked as (
  select id, row_number() over (partition by owner, play_store_url order by created_at, id) as position
  from public.community_apps where play_store_url is not null
)
update public.community_apps a set duplicate_archived_at = now()
from ranked where a.id = ranked.id and ranked.position > 1;

create unique index community_apps_one_live_listing_per_owner
on public.community_apps(owner, play_store_url)
where play_store_url is not null and duplicate_archived_at is null;

create policy hide_archived_live_duplicates on public.community_apps
as restrictive for select using (duplicate_archived_at is null);

create or replace function public.community_post_live_app(p_name text, p_description text, p_android text, p_link text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare app_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_link is null then raise exception 'Play Store link required'; end if;
  insert into public.community_apps(owner, name, description, android, spots, play_store_url)
  values (auth.uid(), p_name, p_description, p_android, 1, p_link)
  on conflict (owner, play_store_url) where play_store_url is not null and duplicate_archived_at is null
  do nothing returning id into app_id;
  if app_id is null then
    select id into app_id from public.community_apps
    where owner = auth.uid() and play_store_url = p_link and duplicate_archived_at is null;
  end if;
  return app_id;
end;
$$;
commit;
