-- Apply to a Supabase project before switching Testlane's backend.
begin;
create table public.community_members (
  id uuid primary key default auth.uid() references auth.users(id),
  name text not null check (char_length(trim(name)) between 2 and 40)
);
create table public.community_apps (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references public.community_members,
  name text not null check (char_length(trim(name)) between 1 and 80),
  description text not null check (char_length(trim(description)) between 1 and 600),
  android text not null check (char_length(trim(android)) between 1 and 80),
  spots integer not null check (spots between 1 and 100),
  created_at timestamptz not null default now()
);
create table public.community_app_details (
  app uuid primary key references public.community_apps on delete cascade,
  link text not null check (char_length(link) <= 500 and link ~ '^https://play[.]google[.]com/apps/testing/[A-Za-z0-9_.]+/?([?][^[:space:]]*)?$'),
  instructions text not null check (char_length(trim(instructions)) between 1 and 1500)
);
create table public.community_requests (
  app uuid references public.community_apps on delete cascade,
  member uuid default auth.uid() references public.community_members,
  play_email text not null check (char_length(play_email) between 3 and 254),
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  primary key (app,member)
);
create table public.community_feedback (
  id uuid primary key default gen_random_uuid(),
  app uuid not null,
  member uuid not null default auth.uid(),
  body text not null check (char_length(trim(body)) between 5 and 2000),
  created_at timestamptz not null default now(),
  foreign key (app,member) references public.community_requests on delete cascade
);
alter table public.community_members enable row level security;
alter table public.community_apps enable row level security;
alter table public.community_app_details enable row level security;
alter table public.community_requests enable row level security;
alter table public.community_feedback enable row level security;
revoke all on public.community_members,public.community_apps,public.community_app_details,public.community_requests,public.community_feedback from public,anon,authenticated;
grant select on public.community_members,public.community_apps to anon,authenticated;
grant select on public.community_app_details,public.community_requests,public.community_feedback to authenticated;
grant insert(name) on public.community_members to authenticated;
grant insert(app,play_email) on public.community_requests to authenticated;
grant insert(app,body) on public.community_feedback to authenticated;
create policy member_names on public.community_members for select using (true);
create policy member_signup on public.community_members for insert to authenticated with check (id=(select auth.uid()));
create policy public_listings on public.community_apps for select using (true);
create policy requests_for_parties on public.community_requests for select to authenticated using (
  member=(select auth.uid()) or exists(select 1 from public.community_apps a where a.id=app and a.owner=(select auth.uid()))
);
create policy tester_request on public.community_requests for insert to authenticated with check (
  member=(select auth.uid()) and status='pending' and exists(select 1 from public.community_apps a where a.id=app and a.owner<>(select auth.uid()))
);
create policy details_for_owner_and_approved on public.community_app_details for select to authenticated using (
  exists(select 1 from public.community_apps a where a.id=app and a.owner=(select auth.uid()))
  or exists(select 1 from public.community_requests r where r.app=community_app_details.app and r.member=(select auth.uid()) and r.status='approved')
);
create policy feedback_for_parties on public.community_feedback for select to authenticated using (
  member=(select auth.uid()) or exists(select 1 from public.community_apps a where a.id=app and a.owner=(select auth.uid()))
);
create policy approved_feedback on public.community_feedback for insert to authenticated with check (
  member=(select auth.uid()) and exists(select 1 from public.community_requests r where r.app=community_feedback.app and r.member=(select auth.uid()) and r.status='approved')
);
create function public.community_post_app(p_name text,p_description text,p_android text,p_spots integer,p_link text,p_instructions text)
returns uuid language plpgsql security definer set search_path='' as $$
declare app_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  insert into public.community_apps(owner,name,description,android,spots)
  values(auth.uid(),p_name,p_description,p_android,p_spots) returning id into app_id;
  insert into public.community_app_details values(app_id,p_link,p_instructions);
  return app_id;
end; $$;
create function public.community_decide_request(p_app uuid,p_member uuid,p_approve boolean)
returns boolean language plpgsql security definer set search_path='' as $$
declare capacity integer;
begin
  if auth.uid() is null then return false; end if;
  select spots into capacity from public.community_apps where id=p_app and owner=auth.uid() for update;
  if not found then return false; end if;
  if p_approve and (select count(*) from public.community_requests where app=p_app and status='approved')>=capacity then return false; end if;
  update public.community_requests set status=case when p_approve then 'approved' else 'declined' end
    where app=p_app and member=p_member and status='pending';
  return found;
end; $$;
revoke all on function public.community_post_app(text,text,text,integer,text,text),public.community_decide_request(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.community_post_app(text,text,text,integer,text,text),public.community_decide_request(uuid,uuid,boolean) to authenticated;
commit;
