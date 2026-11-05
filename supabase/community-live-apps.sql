begin;

alter table public.community_apps
  add column play_store_url text,
  add constraint community_apps_play_store_url_check check (
    play_store_url is null or play_store_url ~ '^https://play[.]google[.]com/store/apps/details[?]id=[A-Za-z][A-Za-z0-9_]*([.][A-Za-z][A-Za-z0-9_]*)+$'
  );

create function public.community_post_live_app(p_name text, p_description text, p_android text, p_link text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare app_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_link is null then raise exception 'Play Store link required'; end if;
  insert into public.community_apps(owner, name, description, android, spots, play_store_url)
  values (auth.uid(), p_name, p_description, p_android, 1, p_link)
  returning id into app_id;
  return app_id;
end;
$$;
revoke all on function public.community_post_live_app(text,text,text,text) from public,anon,authenticated;
grant execute on function public.community_post_live_app(text,text,text,text) to authenticated;

create policy live_listings_exclude_test_requests on public.community_requests
as restrictive for insert to authenticated with check (
  exists(select 1 from public.community_apps a where a.id = app and a.play_store_url is null)
);
commit;
