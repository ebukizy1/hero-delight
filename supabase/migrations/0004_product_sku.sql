-- Run this once in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new)
-- for the emaxsolarstore project. Adds a human-readable `sku` to every product, derived from
-- its name (e.g. "Solar Streetlight 60W" -> "solar-streetlight-60w"), so product URLs and the
-- content_ids sent to Meta Pixel/CAPI stop being raw UUIDs.
--
-- Safe to re-run: every statement is idempotent, and the backfill only touches rows that
-- don't have a SKU yet. The app falls back to the UUID if this hasn't been run
-- (src/lib/products.ts), so it's not launch-blocking.

alter table public.products add column if not exists sku text;

-- Same rules as slugify() in src/lib/products.ts — keep them in sync.
create or replace function public.product_sku_base(name text)
returns text
language sql
immutable
as $$
  select coalesce(
    nullif(
      trim(both '-' from regexp_replace(regexp_replace(lower(trim(name)), '[^a-z0-9\s-]', '', 'g'), '[\s-]+', '-', 'g')),
      ''
    ),
    'product'
  );
$$;

-- Backfill existing products, oldest first, so the first product with a given name keeps
-- the clean SKU and later duplicates get "-2", "-3", …
with numbered as (
  select
    id,
    product_sku_base(name) as base,
    row_number() over (partition by product_sku_base(name) order by created_at, id) as n
  from public.products
)
update public.products p
set sku = case when numbered.n = 1 then numbered.base else numbered.base || '-' || numbered.n end
from numbered
where p.id = numbered.id and p.sku is null;

create unique index if not exists products_sku_key on public.products (sku);

-- Safety net for inserts that don't send a SKU (e.g. rows added directly in the Supabase
-- table editor): generate one from the name, appending -2, -3, … until it's unique.
create or replace function public.products_set_sku()
returns trigger
language plpgsql
as $$
declare
  base text;
  candidate text;
  n int := 1;
begin
  if new.sku is not null and new.sku <> '' then
    return new;
  end if;
  base := product_sku_base(new.name);
  candidate := base;
  while exists (select 1 from public.products where sku = candidate and id <> new.id) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
  new.sku := candidate;
  return new;
end;
$$;

drop trigger if exists products_set_sku on public.products;
create trigger products_set_sku
  before insert or update on public.products
  for each row execute function public.products_set_sku();
