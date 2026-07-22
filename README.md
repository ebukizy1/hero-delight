# Emax Solar Store

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `VITE_PAYSTACK_PUBLIC_KEY` once you have a Paystack account (card payments stay disabled, Cash on Delivery still works, until this is set).
3. Run every file in `supabase/migrations/` **in order** once in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new) for this project:
   - `0001_orders.sql` — creates the `orders` table the checkout flow writes to. Until this runs, checkout and `/admin/orders` fail with a 404 ("relation \"orders\" does not exist").
   - `0002_articles.sql` — creates the `articles` table behind Solar Insights (guides + comparisons) on the public site and `/admin/insights`.
4. `npm run dev`
