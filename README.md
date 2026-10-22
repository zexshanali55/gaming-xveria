# Gaming Xveria

A cyberpunk / Asphalt-themed game store built with Next.js 16 (App Router). Frontend and backend are both in this one app. Payment is **PayFast only**, ported from the Kavé store.

- **Storefront:** home, game list with filters (`/games`), game page (`/games/[slug]`), cart, checkout, order confirmation, account login/signup
- **Admin** (`/admin`): dashboard, orders (change status, see PayFast attempts), products (add/edit/delete), vouchers (create/toggle/delete), users (make or remove admin)
- **Catalogue:** 63 real games with Steam cover art. Two kinds:
  - **Digital** (PC key). After payment the key and download link are emailed. No shipping.
  - **Physical** (PS5 / Xbox disc). Delivered to an address for a flat Rs 350.
- **Policy pages** that PayFast reviews: about, contact, terms, privacy, refund, shipping. Edit the business details in `src/data/site.ts`.

## Run locally

```bash
cp .env.example .env        # set DATABASE_URL (any PostgreSQL)
npm install
npx prisma migrate deploy
npm run db:seed             # games, vouchers NITRO10 / XVERIA20 / WELCOME1000, admin login
npm run dev
```

Default admin: `admin@gamingxveria.com` / `Xveria@2026`. Change it with `ADMIN_EMAIL` and `ADMIN_PASSWORD` before you seed.

## Deploy (live domain)

Deploy the same way as Kavé (Hostinger web app or Vercel): `npm install`, `npm run build`, then `npm start`. `npm start` runs the migrations itself. Run `npm run db:seed` once against the live database.

Required environment variables: `DATABASE_URL`, `SITE_URL` (the https domain), `SESSION_SECRET`, plus the PayFast variables.

## PayFast

`PAYFAST_MODE` sets the mode:

- `mock`: no gateway. The payment is simulated, so you can walk the whole flow without credentials.
- `sandbox`: uses the `PAYFAST_SANDBOX_*` credentials.
- `live`: uses the `PAYFAST_LIVE_*` credentials.

URLs to give PayFast (they are sent automatically on every transaction):

- Success / failure: `https://<domain>/api/payments/payfast/callback`
- IPN (CHECKOUT_URL): `https://<domain>/api/payments/payfast/ipn`

An order is marked paid only when all of these hold: PayFast's `validation_hash` matches, the amount matches, and the basket id is one this shop created. The secured key never reaches the browser.

Note: no email is sent yet. For digital orders the site *says* the key will be emailed, and the admin sends it by hand from the order page.
