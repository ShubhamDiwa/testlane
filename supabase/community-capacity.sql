-- Apply before deploying the directory UI that reads community_open_spots.
begin;
create or replace function public.community_open_spots()
returns table(app uuid, open_spots integer)
language sql stable security definer set search_path = ''
as $$
  select a.id, greatest(0, a.spots - count(r.app)::integer)
  from public.community_apps a
  left join public.community_requests r on r.app = a.id and r.status = 'approved'
  group by a.id, a.spots;
$$;
revoke all on function public.community_open_spots() from public;
grant execute on function public.community_open_spots() to anon, authenticated;

create or replace function public.community_guard_request_capacity()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare capacity integer;
begin
  -- Serialize with community_decide_request, which locks this same row.
  select spots into capacity from public.community_apps where id = new.app for update;
  if found and (select count(*) from public.community_requests
    where app = new.app and status = 'approved') >= capacity then
    raise exception using errcode = 'P0001', message = 'No tester spots remain for this app.';
  end if;
  return new;
end;
$$;
revoke all on function public.community_guard_request_capacity() from public, anon, authenticated;
create or replace trigger community_guard_request_capacity before insert on public.community_requests
for each row execute function public.community_guard_request_capacity();
commit;
