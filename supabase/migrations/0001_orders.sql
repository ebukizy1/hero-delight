-- Run this once in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new)
-- for the emaxsolarstore project. Creates the `orders` table used by the checkout flow.

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
create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

-- Only signed-in admins (Supabase Auth users) can view or manage orders.
create policy "Authenticated users can read orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');
