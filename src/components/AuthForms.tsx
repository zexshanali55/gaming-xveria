"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "@/app/account/actions";
import { LoadingLabel, PasswordInput } from "@/components/Buttons";

export function LoginForm({ admin = false }: { admin?: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      {admin && <input type="hidden" name="admin" value="1" />}
      <label className="block"><span className="label">Email</span><input name="email" type="email" required className="field" /></label>
      <label className="block"><span className="label">Password</span><PasswordInput name="password" required autoComplete="current-password" /></label>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <button className="btn-volt w-full" disabled={pending} data-loading={pending || undefined}><LoadingLabel loading={pending} text="Authenticating">Log in</LoadingLabel></button>
    </form>
  );
}

function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block"><span className="label">Name</span><input name="name" required className="field" /></label>
      <label className="block"><span className="label">Email</span><input name="email" type="email" required className="field" /></label>
      <label className="block"><span className="label">Mobile (optional)</span><input name="phone" className="field" /></label>
      <label className="block"><span className="label">Password</span><PasswordInput name="password" minLength={8} required autoComplete="new-password" /></label>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <button className="btn-volt w-full" disabled={pending} data-loading={pending || undefined}><LoadingLabel loading={pending} text="Creating">Create account</LoadingLabel></button>
    </form>
  );
}

export function AuthTabs() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  return (
    <div className="cut mx-auto max-w-md border border-neon/40 bg-panel p-8">
      <div className="mb-6 grid grid-cols-2 border border-line">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`py-3 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] ${tab === t ? "bg-neon text-void" : "text-ink-dim"}`}
          >
            {t === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>
      {tab === "login" ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
