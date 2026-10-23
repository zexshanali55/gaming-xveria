import { AdminTitle } from "@/components/admin";
import { savePaymentMode, testPayfast } from "@/app/admin/(panel)/actions";
import { configProblem, payfastConfigFor, type PayfastMode } from "@/lib/payfast";
import { getPaymentMode } from "@/lib/settings";
import { siteOrigin } from "@/lib/site-url";

const MODES: { value: PayfastMode; title: string; note: string }[] = [
  { value: "mock", title: "Mock", note: "No real gateway. Every payment is approved instantly — for testing the flow." },
  { value: "sandbox", title: "Sandbox", note: "PayFast test gateway (ipguat.apps.net.pk) with the sandbox credentials." },
  { value: "live", title: "Live", note: "Real PayFast (ipg1.apps.net.pk). Real cards, real money." },
];

type Search = Promise<{ test?: string; msg?: string }>;

export default async function SettingsPage({ searchParams }: { searchParams: Search }) {
  const [mode, query] = await Promise.all([getPaymentMode(), searchParams]);
  const origin = siteOrigin();
  const local = /localhost|127\.0\.0\.1/.test(origin);

  return (
    <>
      <AdminTitle title="Settings" />

      <section className="max-w-3xl border border-line bg-panel p-5 sm:p-6">
        <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]">Payment mode</h2>
        <p className="mt-1 text-sm text-ink-dim">Applies to new checkouts right away. Payments already started keep the mode they began in.</p>

        <form action={savePaymentMode} className="mt-5 space-y-3">
          {MODES.map((m) => {
            const problem = configProblem(payfastConfigFor(m.value));
            return (
              <label key={m.value} className="flex cursor-pointer gap-3 border border-line p-4 transition-colors hover:border-neon has-[:checked]:border-volt has-[:checked]:bg-volt/5">
                <input type="radio" name="mode" value={m.value} defaultChecked={mode === m.value} className="mt-1 accent-[#ffe500]" />
                <span>
                  <span className="font-display text-xs font-bold uppercase tracking-[0.2em]">
                    {m.title}
                    {mode === m.value && <span className="ml-2 text-volt">· active</span>}
                  </span>
                  <span className="mt-1 block text-sm text-ink-dim">{m.note}</span>
                  {problem && <span className="mt-1 block text-sm text-danger">{problem}</span>}
                </span>
              </label>
            );
          })}
          <button className="btn-volt mt-2">Save mode</button>
        </form>
      </section>

      <section className="mt-6 max-w-3xl border border-line bg-panel p-5 sm:p-6">
        <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]">Test PayFast connection</h2>
        <p className="mt-1 text-sm text-ink-dim">Requests an access token with that mode&apos;s credentials. Nothing is charged.</p>
        {query.msg && (
          <p className={`mt-4 border p-3 text-sm ${query.test === "ok" ? "border-ok/50 text-ok" : "border-danger/50 text-danger"}`}>{query.msg}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {(["sandbox", "live"] as const).map((m) => (
            <form key={m} action={testPayfast}>
              <input type="hidden" name="mode" value={m} />
              <button className="btn-neon cut-sm">Test {m}</button>
            </form>
          ))}
        </div>
        <p className="mt-5 text-sm text-ink-dim">
          Return URLs use <span className="text-neon">{origin}</span>.
          {local && (
            <span className="mt-2 block text-volt">
              On localhost the browser return works, but PayFast&apos;s server-to-server IPN cannot reach your machine — the order is still settled from the signed browser return.
            </span>
          )}
        </p>
      </section>
    </>
  );
}
