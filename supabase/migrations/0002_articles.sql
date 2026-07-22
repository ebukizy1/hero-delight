-- Run this once in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new)
-- for the emaxsolarstore project. Creates the `articles` table used by Solar Insights
-- (product guides + comparison articles) on the public blog and the admin editor.
--
-- Safe to re-run: it patches an existing `articles` table (adding missing columns/
-- policies) rather than assuming a clean slate, and every step is idempotent.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  content text not null,
  featured_image text,
  center_image text,
  meta_description text,
  published boolean not null default true,
  published_date date,
  sales_page_url text
);

-- Backfill columns that may be missing if `articles` was created before article_type existed.
alter table public.articles add column if not exists article_type text not null default 'guide';
alter table public.articles add column if not exists sales_page_url text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'articles_article_type_check') then
    alter table public.articles
      add constraint articles_article_type_check check (article_type in ('guide', 'comparison'));
  end if;
end $$;

create index if not exists articles_published_created_idx
  on public.articles (published, created_at desc);

create index if not exists articles_type_idx
  on public.articles (article_type);

alter table public.articles enable row level security;

-- Everyone (including anonymous shoppers) can read published articles.
-- Signed-in admins can also read drafts so they show up in the admin list.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'articles' and policyname = 'Anyone can read published articles'
  ) then
    create policy "Anyone can read published articles"
      on public.articles for select
      using (published = true or auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'articles' and policyname = 'Authenticated users can create articles'
  ) then
    create policy "Authenticated users can create articles"
      on public.articles for insert
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'articles' and policyname = 'Authenticated users can update articles'
  ) then
    create policy "Authenticated users can update articles"
      on public.articles for update
      using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'articles' and policyname = 'Authenticated users can delete articles'
  ) then
    create policy "Authenticated users can delete articles"
      on public.articles for delete
      using (auth.role() = 'authenticated');
  end if;
end $$;
