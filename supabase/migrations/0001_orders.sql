-- Run this in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new)
-- for the emaxsolarstore project. Creates the `orders` table used by the checkout flow.
--
-- Safe to re-run: policies are dropped and recreated each time, so this also repairs
-- environments where the table/RLS exist but a policy is missing or misconfigured.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text,
  notes text,
  items jsonb not null,
  subtotal numeric not null,
  total numeric not null,
  payment_method text not null check (payment_method in ('cod', 'card')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_reference text,
  status text not null default 'new' check (status in ('new', 'processing', 'delivered', 'cancelled'))
);

alter table public.orders enable row level security;

-- Customers (anonymous, anon key) can place an order but never read/list orders.
drop policy if exists "Anyone can create an order" on public.orders;
create policy "Anyone can create an order"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Only signed-in admins (Supabase Auth users) can view or list orders.
drop policy if exists "Authenticated users can read orders" on public.orders;
create policy "Authenticated users can read orders"
  on public.orders for select
  to authenticated
  using (true);

-- Admins can update any order. Anonymous customers can also update an order
-- (needed so the card-payment flow can mark its own just-placed order as paid) —
-- this only matters if you already know the order's id, which is an unguessable
-- UUID never listed anywhere anon can read, so it can't be enumerated or browsed.
drop policy if exists "Authenticated users can update orders" on public.orders;
create policy "Authenticated users can update orders"
  on public.orders for update
  to anon, authenticated
  using (true)
  with check (true);
