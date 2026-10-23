# Gaming Xveria — guide for AI assistants

Read this first, then `docs/ASSISTANT_NOTES.md` (decisions, gotchas, history). `README.md` covers setup and deploy for humans.

## What it is

A Pakistani online game store (PC keys by email, PS5/Xbox discs by courier), cyberpunk/neon look. One Next.js 16 App Router app is both frontend and backend. Payment is **PayFast Pakistan (APPS / Bank Alfalah IPG) only**. The owner talks in Roman Urdu/Hindi, so reply the same way.

## Stack

- Next.js 16.3 (App Router, React 19, server actions), TypeScript, Tailwind CSS v4 (theme tokens in `src/app/globals.css` `@theme`)
- PostgreSQL on Supabase via Prisma 7 + `@prisma/adapter-pg` (no Rust engine). The client is generated to `src/generated/prisma` (gitignored, made by `postinstall`/`prebuild`)
- zod for request validation. No other runtime deps, and no `next/image`/sharp on purpose (shared-hosting glibc). Use plain `<img>`.
- Fonts: Orbitron (display, 700/900) and Rajdhani (body, 400/600/700) via `next/font`

## Commands

```bash
npm run dev            # dev server :3000 (slow per request: compiles on demand, judge speed with build+start)
npm run build          # prisma generate + next build --webpack
npm start              # prisma migrate deploy + next start
npm run typecheck      # tsc --noEmit
npm run lint
npm run db:migrate     # prisma migrate deploy
npm run db:seed        # upserts 63 games, vouchers, admin user (idempotent)
```

No test suite. Verify with typecheck, lint, build, and by loading pages.

## Map

```
prisma/schema.prisma        User, Product, Voucher, Order, OrderItem, PaymentAttempt, Setting
prisma/seed.ts              seeds from src/data/games.ts
src/app/                    storefront pages: / , /games, /games/[slug], /cart, /checkout,
                            /checkout/pay/[orderId], /order/[id], /account, policy pages
src/app/admin/login         admin login
src/app/admin/(panel)/      dashboard, orders, products, vouchers, users, settings
src/app/admin/(panel)/actions.ts   ALL admin server actions (each starts with requireAdmin())
src/app/api/checkout        creates the order (prices from DB via lib/pricing.ts)
src/app/api/payments/payfast/{initiate,callback,ipn}   PayFast handshake
src/app/api/vouchers/check  voucher preview at checkout
src/components/             Header, MobileNav (phone bottom tabs), Footer, ProductCard, CartProvider
                            (cart in localStorage), CheckoutForm, PayfastHandoff, Skeletons, admin.tsx
src/lib/payfast.ts          gateway: config per mode, token request, form fields, hash checks
src/lib/payments.ts         settlePayfastResult(): the ONLY place an order becomes PAID
src/lib/settings.ts         runtime settings in the Setting table (payment mode, checkout payment text)
src/lib/payfast-client.ts   browser handoff: goToPayfast(orderId) POSTs straight to PayFast
src/lib/catalog.ts          cached storefront queries (unstable_cache, tag "catalog")
src/lib/auth.ts             cookie sessions (HMAC-signed), scrypt passwords, requireAdmin()
src/lib/pricing.ts          server-side cart pricing + voucher + shipping
src/data/site.ts            business name, contact email, policy details
src/data/games.ts           seed catalogue (Steam art via steamArt())
```

## Rules that matter

- **Money:** prices are integer rupees. Never trust amounts from the browser; `lib/pricing.ts` and the order row are the source of truth.
- **PayFast:** an order becomes PAID only in `settlePayfastResult` after basket id + `validation_hash` (or the mock HMAC) + amount + approved `err_code` all check out. It is idempotent (conditional `updateMany` on `settledAt: null`). Don't mark orders paid anywhere else. The secured key never goes to the client.
- **Payment mode** = `Setting["payfast.mode"]` (admin → Settings), else `PAYFAST_MODE` env. Read it with `getPaymentMode()`. Settlement uses the mode stored on the `PaymentAttempt`, not the current one.
- **Caching:** storefront product reads go through `lib/catalog.ts` cached helpers. When you change product data, call `updateTag(CATALOG_TAG)` (server action) or `revalidateTag(CATALOG_TAG, "max")` (elsewhere). Cached values are JSON, so keep `Date` fields out of them.
- **Pages stay `force-dynamic`** so `next build` never needs the database; speed comes from the data cache.
- **Mobile first:** design for 390px, then `sm:`/`md:`/`lg:`. Phones get `MobileNav` (bottom tabs) and swipeable chip rows (`no-scrollbar` + `overflow-x-auto`). In a single-column grid holding a scroll row, use `grid-cols-1` (minmax(0,1fr)) or the row widens the page.
- **Glitch (owner's taste: clearly visible and cyberpunk, but never janky):** use `<Glitch text="..." />` (`src/components/Glitch.tsx`). The real element never moves or gets clipped. Tinted `::before/::after` copies slice across it in a short burst, then pause (`slice-a/b`). It fires while a parent `.glitch-host` is hovered, or every ~4s with `auto`. Product art uses two `.glitch-img` layers. Never put `clip-path`/transform jitter on the element itself (it breaks `.cut` corners and fights the card lift). Hovers live under `@media (hover: hover)`. Other motion: `rise rise-1..4` for entrance, `reveal` on scroll, and `hud` for corner brackets. Don't name classes after Tailwind utilities (`ring` clashed, hence `hud-ring`). `prefers-reduced-motion` turns everything off.
- **Loaders:** `src/components/Skeletons.tsx` has a per-route skeleton plus a HUD panel (`Hud`). Home is in the `(home)` route group so its loader doesn't show on other pages; `app/loading.tsx` is the generic `PageLoader`.
- Admin server actions must call `requireAdmin()` first.
- Never print `.env` values. Mask them when inspecting.
