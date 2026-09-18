# Emax Solar Store

> For architecture, data model, design system, integrations, and everything else beyond local setup, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `VITE_PAYSTACK_PUBLIC_KEY` once you have a Paystack account (card payments stay disabled, Cash on Delivery still works, until this is set).
3. Run every file in `supabase/migrations/` **in order** once in the Supabase SQL editor (https://supabase.com/dashboard/project/_/sql/new) for this project:
   - `0001_orders.sql` — creates the `orders` table the checkout flow writes to. Until this runs, checkout and `/admin/orders` fail with a 404 ("relation \"orders\" does not exist").
   - `0002_articles.sql` — creates the `articles` table behind Solar Insights (guides + comparisons) on the public site and `/admin/insights`.
   - `0003_product_features.sql` — adds the `features`/`runs_on`/`runs_on_note` columns behind the Product Detail page's Features tab and "What this actually runs" card.
4. `npm run dev`

## Order confirmation emails (optional but recommended)

Deploy the `send-order-email` Supabase Edge Function and set its secrets — see [DOCUMENTATION.md §10](./DOCUMENTATION.md#10-supabase-edge-functions) for the exact commands and the Resend domain-verification caveat.
