-- Run this once in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new)
-- for the emaxsolarstore project. Adds the columns behind the redesigned product detail
-- page's Features tab and "What this actually runs" card.
--
-- Safe to re-run: every statement is idempotent. The app already degrades gracefully if
-- these columns are missing (src/lib/products.ts safeWrite), so this migration can be run
-- at any time without breaking existing writes.

alter table public.products add column if not exists features text[] not null default '{}';
alter table public.products add column if not exists runs_on text[] not null default '{}';
alter table public.products add column if not exists runs_on_note text;
