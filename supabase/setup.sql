-- Movement Tree only. Existing member tables/policies are not modified.
begin;
create table if not exists public.movement_tree_documents (
  id uuid primary key,
  revision bigint not null default 1,
  document jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.movement_tree_documents enable row level security;
revoke all on public.movement_tree_documents from anon, authenticated;

create or replace function public.mt_load(p_key uuid)
returns jsonb language sql security definer set search_path = '' as $$
 select jsonb_build_object('revision',revision,'document',document,'updated_at',updated_at)
 from public.movement_tree_documents where id=p_key;
$$;
create or replace function public.mt_version(p_key uuid)
returns bigint language sql security definer set search_path = '' as $$
 select revision from public.movement_tree_documents where id=p_key;
$$;
create or replace function public.mt_save(p_key uuid,p_expected bigint,p_doc jsonb)
returns bigint language plpgsql security definer set search_path = '' as $$
declare next_version bigint;
begin
 if jsonb_typeof(p_doc->'nodes') is distinct from 'array' or octet_length(p_doc::text)>5000000 then
  raise exception 'Invalid tree document';
 end if;
 if p_expected=0 then
  insert into public.movement_tree_documents(id,document) values(p_key,p_doc)
  on conflict do nothing returning revision into next_version;
 else
  update public.movement_tree_documents set document=p_doc,revision=revision+1,updated_at=now()
  where id=p_key and revision=p_expected returning revision into next_version;
 end if;
 if next_version is null then raise exception 'TREE_CONFLICT' using errcode='40001'; end if;
 return next_version;
end;
$$;
create or replace function public.mt_workspace_exists(p_key text)
returns boolean language sql security definer set search_path = '' as $$
 select exists(select 1 from public.movement_tree_documents where id::text=p_key);
$$;
revoke all on function public.mt_load(uuid), public.mt_version(uuid), public.mt_save(uuid,bigint,jsonb), public.mt_workspace_exists(text) from public;
grant execute on function public.mt_load(uuid), public.mt_version(uuid), public.mt_save(uuid,bigint,jsonb), public.mt_workspace_exists(text) to anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('movement-tree-images','movement-tree-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
drop policy if exists movement_tree_image_insert on storage.objects;
create policy movement_tree_image_insert on storage.objects for insert to anon,authenticated
with check(bucket_id='movement-tree-images' and public.mt_workspace_exists((storage.foldername(name))[1]));
notify pgrst, 'reload schema';
commit;
