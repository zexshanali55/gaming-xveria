/**
 * The public origin. PayFast's return and IPN URLs are built from it, so on the
 * live domain it must be the real https address. Never read from request.url —
 * behind a host's proxy that can be http://0.0.0.0:3000.
 */
export function siteOrigin(): string {
  const raw = (process.env.SITE_URL ?? "").trim().replace(/\/+$/, "");
  if (raw && !/^https?:\/\/(0\.0\.0\.0|\[?::\]?)(:\d+)?$/.test(raw)) return raw;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
