# Assistant notes

A running log for whoever works on this next (human or AI): what was decided, why, and what is still open. Newest first. Add to it when you change something non-obvious.

## Open items / TODO

- **No emails are sent.** Digital orders say "key will be emailed"; the admin sends keys by hand from the order page. A mail provider (Resend, SMTP) is the next big feature.
- **IPN on localhost:** PayFast's server-to-server IPN (`/api/payments/payfast/ipn`) can't reach `localhost`. Locally, orders settle from the signed browser return (`/callback`). For a full IPN test, expose the dev server with a tunnel (cloudflared/ngrok) and set `SITE_URL` to the tunnel URL.
- **Live mode on localhost charges real money.** Use Sandbox for testing; switch to Live only on the real domain.
- `PAYFAST_SANDBOX_STORE_ID` is empty (optional, so it's left out of the form).
- The Steam CDN serves all cover art. If Steam changes URLs, images break; consider self-hosting the art later.

## 2026-10-23 (evening): cart popup, direct PayFast, editable payment text, icons

- **Add-to-cart popup:** `CartProvider.add()` shows `CartToast` (bottom centre, above the phone tab bar) with "View cart (n)" for 3.5s. "Buy now" passes `{ silent: true }`. The toast is hidden on /cart and /checkout.
- **No intermediate page:** CheckoutForm creates the order, then `goToPayfast()` (`src/lib/payfast-client.ts`) builds and submits the PayFast form right away. `/checkout/pay/[orderId]` remains only as the "retry payment" page linked from an unpaid order. A `pageshow` listener un-sticks the busy button when the shopper comes back from PayFast with Back.
- **Payment method title/subheading** are editable in Admin → Settings (`Setting` keys `checkout.paymentTitle` and `checkout.paymentSubtitle`, read via `getPaymentText()`). Empty values fall back to the defaults.
- **Delivery charge setting:** Admin → Settings → Delivery charges (`Setting` key `shipping.fee`, 0 = free, default `DEFAULT_SHIPPING_FEE` 350). `getShippingFee()` is cached under tag `settings` and saving calls `updateTag`. It is used by `lib/pricing.ts` (authoritative), the cart (`components/CartView.tsx`, with `app/cart/page.tsx` as a server wrapper), the checkout, the product page and the /shipping policy (`deliveryLabel()`).
- **Icons/meta:** `app/icon.svg` (yellow cut-corner X), `apple-icon.tsx` and `opengraph-image.tsx` (generated with `next/og`), `manifest.ts`, plus short OG/Twitter metadata in `layout.tsx`. `metadataBase` = `SITE_URL`, so share previews only work once that is the real domain.

## 2026-10-23 (later): glitch v3 and cyberpunk loaders

The toned-down glitch (v2) was too invisible ("glitch khatm hi hogya"). v3 is layered: `<Glitch>` renders `data-text`, and tinted `::before/::after` copies slice across it in a ~0.5s burst, then rest (1.6s loop on hover, a 4s loop with `auto`). Product cards add two hue-shifted `.glitch-img` copies of the art (same URL, so the browser cache serves them) that slice sideways. Buttons get a light sweep (`shine`). HUD corner brackets (`.hud`) go on cards. The element itself never moves, which is what made v1 buggy.

Loaders: each route has its own skeleton (home / games / product) with a HUD panel: double spinning ring, glitch title, terminal lines, neon load bar. The skeleton bars are a dark panel with scanlines and a neon sweep instead of a grey shimmer. Home moved to `src/app/(home)/` so its loader is scoped. `app/loading.tsx` is a generic HUD loader for every other page.

## 2026-10-23: payment mode setting, speed, mobile-first UI

**Payment mode in admin.** New `Setting` table (key/value) and migration `20261023120000_settings`. `/admin/settings` has Mock / Sandbox / Live radios (shows missing-credential warnings per mode) and "Test sandbox / Test live" buttons. Those buttons call `GetAccessToken` with that mode's credentials (no charge) and show the result. `payfastConfig()` (env-only) was removed. Use `payfastConfigFor(await getPaymentMode())`. Both sandbox and live credentials were verified working that day (tokens returned).

**Speed.** Root cause of "site slow":
1. The DB is remote (Supabase), so each query costs ~300ms and a fresh connection ~3s. Every storefront page hit the DB on every request. Fix: `lib/catalog.ts` wraps reads in `unstable_cache` (tag `catalog`, 10 min). Admin product saves call `updateTag`; a paid order calls `revalidateTag(..., "max")` since stock changed. Result in a production build: the first hit is 0.4–2s, then ~10ms.
2. At one point `DATABASE_URL` pointed at a Supabase tenant that no longer existed. Every page waited ~4s and then errored. The owner switched to a new Supabase project in `ap-south-1` (Mumbai).
3. `npm run dev` is slow by nature. Measure with `npm run build && npx next start -p 3100`.
4. Smaller wins: font weights cut from 8 files to 5. The hero loads the small Steam `header.jpg` on phones and the 3840px `library_hero` only at `lg` (`fetchPriority="high"`). Preconnect to the Steam CDN. The fixed scanline overlay and header `backdrop-blur` are desktop only (they caused scroll jank on phones). `loading.tsx` skeletons for `/`, `/games` and `/games/[slug]`.

**Glitch hovers, toned down (same day).** The owner found the first version too fast and buggy: `clip-path` slicing broke the buttons' cut corners, and the `steps()` jitter clashed with the card lift. Now hovers use smooth transitions plus one soft `glitch-soft` text-shadow pulse (1–2px RGB split, 1.6s ease). There is no translate jitter or clip-path in any hover, and the logo/hero `glitch` only shifts text-shadow. (Superseded by glitch v3 above: the owner wants it visible.)

**UI.** Mobile first: a bottom tab bar (`MobileNav`), header categories as swipe chips (the hamburger was removed), 2-column product grids on phones, swipeable filter rows on `/games`, tighter type and padding on small screens. Glitch hovers on buttons, nav links and cards (hover devices only; toned down, see above). Entrance `rise` on the hero, scroll-driven `reveal` on sections (CSS `animation-timeline: view()`, so no JS), and a `flicker` on the hero kicker.

**DB state after the switch:** migrations applied and 60 products present, but the `User` table was empty, so no admin existed. Run `npm run db:seed` once (it's an upsert, safe to re-run).

## 2026-10-22: initial build

The Next.js store with a PayFast flow ported from the owner's earlier "Kavé" store. Prisma via the pg adapter and plain `<img>` tags, both chosen to fit shared hosting with an old glibc (no native modules). Contact email is info@gamingxveria.site, with no phone number shown.
