# Emax Solar Store — Developer Documentation

This document is the technical reference for the Emax Solar Store codebase: what it is, how it's put together, the conventions used throughout, and everything a new developer needs to get productive. For a quick local setup, see `README.md` — this document goes deeper.

---

## 1. What this is

A mobile-first e-commerce storefront for Emax Solar Store (Lagos, Nigeria), selling solar street lights, inverters, power stations, fans and security cameras. Customers can browse, filter by category, read buying-guide content ("Solar Insights"), and check out either by **Cash on Delivery** or **card (Paystack)**. There's a lightweight admin panel for managing products and articles and viewing orders. Checkout also fires an order-confirmation email and reports conversions to Meta/Google for ad tracking.

There is no traditional backend server — Supabase (Postgres + Auth + Storage + Edge Functions) is the entire backend, called directly from the React app.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript, built with Vite |
| Routing | React Router v6, route-based code-splitting (`React.lazy`) |
| Styling | Tailwind CSS, CSS-variable-driven theme (see §5), shadcn/ui primitives in `src/components/ui` |
| Backend | Supabase (Postgres, Row Level Security, Auth, Storage, Edge Functions) |
| Payments | Paystack (card), Cash on Delivery (no payment gateway) |
| Email | Resend, called from a Supabase Edge Function |
| Analytics | Google Analytics 4 (gtag), Meta Pixel + server-side Conversions API |
| Support channel | WhatsApp deep links (`wa.me`) — no in-app chat |
| Testing | Vitest + Testing Library (minimal coverage today — see §13) |
| Deployment | Vercel (SPA rewrite in `vercel.json`) |

---

## 3. Getting started

```bash
npm install
cp .env.example .env.local   # fill in VITE_PAYSTACK_PUBLIC_KEY (optional — see below)
npm run dev
```

- **Card payments are optional.** If `VITE_PAYSTACK_PUBLIC_KEY` is unset, `isCardPaymentEnabled()` (`src/lib/payments.ts`) returns false and checkout only offers Cash on Delivery. Nothing else breaks.
- **Database migrations must be run once**, in order, in the Supabase SQL editor for this project (`supabase/migrations/`):
  1. `0001_orders.sql` — the `orders` table checkout writes to.
  2. `0002_articles.sql` — the `articles` table behind Solar Insights.
  3. `0003_product_features.sql` — adds `features`, `runs_on`, `runs_on_note` columns to `products` (Product Detail page's Features tab and "What this actually runs" card). The app degrades gracefully if this hasn't been run yet (see §8.4), so it's not launch-blocking, but content added through the admin won't persist until it is.
- **Creating an admin user**: there's no signup flow. Create a user directly in Supabase Dashboard → Authentication → Users (email + password), then sign in at `/admin/login`. Any authenticated Supabase user can access `/admin/*` — see §12.
- **Supabase Edge Functions** (`supabase/functions/`) are deployed separately via the Supabase CLI, not by `npm run build` — see §10.

---

## 4. Project structure

```
src/
  components/        Shared UI: layout chrome (Header, TopBar, Footer, MobileTabBar),
                      product/article cards, forms, and shadcn primitives under ui/
  pages/              One file per route (see §6). Admin pages are prefixed Admin*.
  lib/                Framework-free logic: Supabase client, data access (products/
                      articles/orders), cart state, payments, analytics, image
                      optimization, WhatsApp link builders
  hooks/              A couple of small shared hooks (use-mobile, use-toast)
  assets/             Bundled images (hero photo, etc.) — product/article images
                      themselves live in Supabase Storage, not here
  test/               Vitest setup + one placeholder test
supabase/
  migrations/         Hand-written SQL, run manually (no CLI-managed migration history)
  functions/          Deno Edge Functions (capi-event, send-order-email)
scripts/
  generate-sitemap.mjs  Runs on `prebuild`, writes public/sitemap.xml from live routes
```

### Key files to read first
- `src/App.tsx` — the route table and lazy-loading setup.
- `src/lib/products.ts` / `src/lib/orders.ts` / `src/lib/articles.ts` — the data layer.
- `src/lib/cart.ts` — client-side cart state.
- `src/index.css` (top of file) + `tailwind.config.ts` — the design tokens.

---

## 5. Design system

All color is driven by HSL CSS variables defined once in `src/index.css` under `:root`, then mapped to Tailwind utility names in `tailwind.config.ts` (e.g. `--primary` → `bg-primary`/`text-primary`). **Always use the token utilities** (`bg-primary`, `text-accent`, `bg-success`, etc.) rather than hardcoding colors, so a future palette change stays a one-file edit.

| Token | Hex (approx.) | Used for |
|---|---|---|
| `--background` / `bg-background` | `#FBFAF8` warm paper | Page background |
| `--foreground` / `text-foreground` | `#0E2138` ink navy | Body text, headings |
| `--primary` / `bg-primary` | `#0E2138` ink navy | Buttons, header nav bar, navy hero sections, footer |
| `--accent` / `text-accent` | `#D97706` solar amber | Prices, savings text, links |
| `--accent-strong` / `bg-accent-strong` | `#B45309` | Solid amber backgrounds (badges, CTA buttons) — `--accent` itself is tuned for use as *text*, not a fill, so don't use it as a button background |
| `--accent-light` / `text-accent-light` | `#F2A93B` | Amber accents on navy backgrounds |
| `--success` / `bg-success` | `#25A05A` | WhatsApp buttons, in-stock indicators, success states |
| `--secondary` / `bg-secondary` | `#F6F4EF` warm shade | Card/section backgrounds one step off white |
| `--border` | `#E4E2DD` hairline | All borders |

`--hero-bg` / `--gradient-hero` / `bg-hero-glow` are an older dark-gradient hero treatment, kept only for `NotFound.tsx`'s full-bleed error page. Every other page uses a solid `bg-primary` navy hero instead — don't reintroduce `bg-hero-glow` elsewhere.

### Recurring layout pattern
Almost every customer-facing page follows the same composition:
```tsx
<TopBar />                        {/* thin navy delivery-promise strip, always visible */}
<Header />                        {/* logo, search, nav — full on desktop */}
{/* ...page content... */}
<Footer />
<MobileTabBar />                  {/* fixed bottom nav: Home/Shop/Insights/Cart — mobile only */}
```
Pages centered on a single focused task (**Product Detail**, **Checkout**, **Blog Article**) replace the full `Header` with just a back-link strip *on mobile only*, and skip `MobileTabBar` in favor of a page-specific sticky action bar (Add to cart / Place order):
```tsx
<div className="hidden lg:block"><Header /></div>
<div className="lg:hidden border-b border-border">
  <Link to="/shop">← Back</Link>
</div>
```
This mobile-vs-desktop split (`hidden lg:block` / `lg:hidden` pairs, not separate components) is the standard way responsive differences are handled throughout — search for `lg:hidden` in a page before assuming you need a new component.

### Loading states
- Full-page loads with nothing else rendered yet (route transitions, Product Detail/Blog Article before data arrives) use `<LogoLoader />` (`src/components/LogoLoader.tsx`) — the animated logo mark, not a generic spinner.
- Smaller in-page loading (a product grid while data fetches, with the header already visible) still uses a plain `lucide-react` `Loader2` spinner — intentionally, a full logo animation is too heavy for a small inline area.

---

## 6. Routes

| Path | Page | Notes |
|---|---|---|
| `/` | `Index` | Home: hero, deals carousel, categories, best sellers, Solar Insights teaser |
| `/shop` | `Shop` | Full paginated catalog with category filter pills |
| `/category/:slug` | `CategoryPage` | Products in one category (slug via `categorySlug.ts`) |
| `/product/:id` | `ProductDetail` | Gallery, price, specs/features tabs (mobile) / sections (desktop), related products |
| `/about` | `AboutPage` | Static brand/values page |
| `/checkout` | `Checkout` | Delivery details + payment method; redirects to cart-empty state if cart is empty |
| `/order-success/:id` | `OrderSuccess` | Reads the just-placed order from router state |
| `/insights` | `BlogList` | Guides & comparisons list, filterable |
| `/insights/:slug` | `BlogArticle` | Full article (Markdown → HTML via `marked`) |
| `/admin/login` | `AdminLogin` | Supabase Auth email/password |
| `/admin/dashboard`, `/admin/add-product`, `/admin/edit-product/:id`, `/admin/orders`, `/admin/insights`, `/admin/insights/add`, `/admin/insights/edit/:id` | Admin pages | All wrapped in `<AdminGuard>` |
| `*` | `NotFound` | Catch-all 404 |

All routes are lazy-loaded in `App.tsx`; add new pages the same way (`const X = lazy(() => import("./pages/X.tsx"))`).

---

## 7. Data model

Three domain types, each with a Supabase table behind it and a `lib/*.ts` file as the only place that talks to that table.

### Product (`src/lib/products.ts`, table `products`)
```ts
interface Product {
  id: string;
  name: string;
  price: number;              // what the customer pays
  bonusPrice?: number | null; // "was" price, shown struck-through when set
  category: string;
  image: string; images: string[]; // up to 3 photos
  description: string;
  featured: boolean;          // surfaces in home page carousels
  specifications: Array<{ label: string; value: string }>;
  features: string[];               // Product Detail "Features" tab
  runsOn: string[]; runsOnNote: string | null; // "What this actually runs" card
}
```
`CATEGORIES` (in the same file) is the fixed list of category names — adding a category means adding it there plus a check-constraint-equivalent nowhere (categories aren't DB-enforced, just a shared TS const).

### Article (`src/lib/articles.ts`, table `articles`)
Guide/comparison content for Solar Insights. `article_type` is `"guide" | "comparison"`. `ArticlePreview` is the same shape minus `content`/`sales_page_url`, used anywhere only a teaser is needed (home page) to avoid downloading full article bodies. `renderMarkdown()` (`src/lib/markdown.ts`) turns `content` (Markdown) into HTML for display.

### Order (`src/lib/orders.ts`, table `orders`)
Created client-side with a `crypto.randomUUID()` id (see §8.3 for why), `payment_status` starting `"pending"` and flipped to `"paid"` after a successful Paystack charge. `items` is a JSON snapshot of the cart at checkout time (not a live reference to `products`), so historical orders stay accurate even if a product is later edited or deleted.

### Schema evolution pattern
`products.ts`'s `safeWrite()` helper lets the *frontend* ship fields (like `features`/`runs_on`) before the matching migration has necessarily been run everywhere: on insert/update, if Postgres rejects a column as unknown, it strips that field and retries, logging a console warning. This means a missing migration degrades to "that field silently isn't saved" rather than a hard error — convenient during rollout, but **don't rely on it long-term**; run the migration.

---

## 8. Core patterns worth knowing before you touch the code

### 8.1 Cart state (`src/lib/cart.ts`)
A hand-rolled store using `useSyncExternalStore` — not Redux/Zustand/Context. State lives in a module-level variable, persisted to `localStorage`, and components subscribe via the `useCart()` hook. `cart.add(product)` / `cart.addQty(product, n)` / `cart.setQty(id, n)` / `cart.remove(id)` are the mutation API. There is no server-side cart; it only becomes a durable `Order` row at checkout.

### 8.2 Image optimization (`src/lib/images.ts`, `src/components/OptimizedImage.tsx`)
Product/article photos are Supabase Storage URLs, rewritten to Supabase's on-the-fly image transform endpoint with explicit width/height/quality and a density-based `srcset`. Non-Supabase sources (bundled assets, blob preview URLs) pass through untouched. **Always render images through `<OptimizedImage>`, never a raw `<img>`**, or you'll ship full-resolution originals to mobile users on slow connections (this was a real, measured problem — see the commit history around "Speed up product/article image loading").

### 8.3 Fire-and-forget side effects
Order confirmation email (`src/lib/orderEmail.ts`) and analytics/Conversions-API mirroring (`src/lib/metaCapi.ts`) both follow the same rule: **never block or fail the user-facing action because a side effect failed.** They're called without `await` (or with `await` inside their own try/catch that swallows errors) after the order/action has already succeeded. If you add a new side effect to checkout, follow this pattern — a broken webhook should never prevent someone from completing a purchase.

### 8.4 Admin auth
`AdminGuard.tsx` wraps every `/admin/*` route, checks `supabase.auth.getSession()`, and redirects to `/admin/login` if there's no session. There are no roles/permissions beyond "authenticated or not" — any Supabase Auth user for this project is a full admin. If you need tiered permissions later, that's new work, not configuration.

### 8.5 SEO
`src/components/Seo.tsx` is a dependency-free per-page component (no `react-helmet`) that sets `document.title`, meta description/OG/Twitter tags, canonical link, and JSON-LD on mount. Every page should render one. `scripts/generate-sitemap.mjs` runs on `prebuild` and writes `public/sitemap.xml`.

---

## 9. Third-party integrations & secrets

| Service | Where configured | Notes |
|---|---|---|
| Supabase | `src/lib/supabase.ts` (URL + anon key hardcoded) | Anon key is meant to be public — access control is entirely via Postgres Row Level Security policies (see the migrations). Don't add anything sensitive to that file. |
| Paystack | `VITE_PAYSTACK_PUBLIC_KEY` env var | Public key only, safe client-side. Card payments silently disable without it. |
| WhatsApp | Hardcoded number in `src/lib/cart.ts` (`WHATSAPP_NUMBER`) | Every "chat with us" / "order via WhatsApp" link in the app builds off `buildWhatsAppLink()` in that file — change the number in exactly one place. |
| Meta Pixel + Conversions API | Pixel ID hardcoded in `index.html`; CAPI token as Supabase secrets `META_PIXEL_ID`/`META_CAPI_TOKEN` for the `capi-event` Edge Function | Browser pixel and server-side CAPI both fire for the same events (ViewContent/AddToCart/Purchase/InitiateCheckout) with a shared `event_id` so Meta deduplicates them. |
| Google Analytics 4 | Measurement ID hardcoded in `index.html`; SPA page-view tracking in `src/lib/analytics.ts` | |
| Resend (order emails) | Supabase secrets `RESEND_API_KEY`, `STORE_FROM_EMAIL` for the `send-order-email` Edge Function | **Requires a verified sending domain in Resend** — until then it can only deliver to the email on the Resend account itself, not to customers. See §10. |

---

## 10. Supabase Edge Functions

Both live in `supabase/functions/` and are Deno runtime (not Node — `nodemailer` and other Node-only packages won't work here). Deploy and configure each with the Supabase CLI:

```bash
supabase functions deploy capi-event
supabase secrets set META_PIXEL_ID=... META_CAPI_TOKEN=...

supabase functions deploy send-order-email
supabase secrets set RESEND_API_KEY=... STORE_FROM_EMAIL="Emax Solar Store <orders@yourverifieddomain.com>"
```
Both are called from the client via `supabase.functions.invoke("<name>", { body: {...} })` and both fail silently on the client (per §8.3) — check **Supabase Dashboard → Edge Functions → Logs** if something isn't arriving, not the browser console.

If you're editing these files in VS Code, `Deno.*` globals will show as errors unless you install the Deno extension — `.vscode/settings.json` (gitignored by default, so it won't appear unless someone adds it back) scopes it to just `supabase/functions/`.

---

## 11. Database migrations

Hand-written SQL in `supabase/migrations/`, run manually and in order via the Supabase SQL editor — there's no Supabase-CLI-managed migration history tying this repo to a project. Every migration is written to be **safe to re-run** (uses `if not exists` / `drop policy if exists` guards), so re-running one you're unsure about won't break anything.

| File | Adds |
|---|---|
| `0001_orders.sql` | `orders` table + RLS (anonymous insert, admin-only read) |
| `0002_articles.sql` | `articles` table + RLS (public read of published articles, admin-only write) |
| `0003_product_features.sql` | `features`, `runs_on`, `runs_on_note` columns on `products` |

When you need a new column or table, add a new numbered file rather than editing an old one — that keeps the history honest about what's actually been run in production.

---

## 12. Admin panel

| Page | Purpose |
|---|---|
| `/admin/dashboard` | Product list, links to add/edit |
| `/admin/add-product`, `/admin/edit-product/:id` | `ProductForm` component — image upload (auto-compressed client-side via `browser-image-compression`), pricing, specs, features, "runs on" checklist |
| `/admin/orders` | Order list (read-only view of the `orders` table) |
| `/admin/insights`, `/admin/insights/add`, `/admin/insights/edit/:id` | Article CRUD via `ArticleForm` — Markdown body, featured/center images, guide vs. comparison type, published toggle |

Uploaded images go to Supabase Storage bucket `product-images` (see `uploadProductImage`/`uploadArticleImage` in the respective `lib/*.ts` files) and are served through the image-transform pipeline in §8.2.

---

## 13. Testing

`vitest` + `@testing-library/react` + `jsdom` are configured (`npm test` / `npm run test:watch`), but coverage today is a single placeholder test in `src/test/example.test.ts`. There is no CI-enforced test gate. In practice, this project has been validated by `npx tsc --noEmit` (type safety) and `npx vite build` (does it actually bundle) after every change, not by an automated test suite — a future developer wanting real regression protection should start by writing tests for `src/lib/cart.ts` and `src/lib/products.ts` (`discountPercent`, `truncateText`, the `safeWrite` degradation logic), since they're pure-ish logic with no network calls.

---

## 14. Deployment

Deployed on Vercel. `vercel.json` contains a single SPA rewrite (`/(.*) → /index.html`) so client-side routes don't 404 on refresh/direct link. `npm run build` runs `prebuild` (sitemap generation) first, then `vite build`.

**Environment variables to set in the Vercel project dashboard** (not committed anywhere): `VITE_PAYSTACK_PUBLIC_KEY` if card payments should be live. Supabase Edge Function secrets (§9/§10) are configured separately via the Supabase CLI/dashboard, not Vercel.

---

## 15. Known gaps / good next tasks

Honest list for whoever picks this up next:

- **Bundle size**: the main JS chunk is ~530KB (pre-existing, not something recently introduced). Worth revisiting `build.rollupOptions.output.manualChunks` if load time becomes a complaint.
- **No real test coverage** (§13).
- **Articles aren't linked to specific products.** The Solar Insights "Products in this guide" / "Shop these products" UI currently shows generically popular/featured products or links to `/shop`, not products actually referenced in that specific article — there's no data relationship for that yet. Building it properly would mean a `product_ids` field on `articles` plus a picker UI in `ArticleForm`, similar in shape to how `features`/`runs_on` were added to products.
- **`main` merge history**: this project's redesign (home, product detail, insights, checkout, plus the email/loader/polish work documented here) was delivered as a stack of feature branches, each merged into `main` via PR. If you're auditing "what shipped when," `git log --merges main` is more informative than individual feature-branch history.
- **Resend domain verification**: confirm this has actually been done in the Resend dashboard before relying on order emails reaching real customers (see §9).
