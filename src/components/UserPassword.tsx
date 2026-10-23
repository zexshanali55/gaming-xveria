"use client";

import { useActionState, useEffect, useState } from "react";
import { setUserPassword, type PasswordState } from "@/app/admin/(panel)/actions";
import { PasswordInput, SubmitButton } from "@/components/Buttons";

/** "Change password" link in Admin → Users that opens a small modal. */
type User = { id: string; name: string; email: string; registered: boolean };

export function UserPassword({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-neon hover:underline">
        {user.registered ? "Change password" : "Set password"}
      </button>
      {open && <PasswordDialog user={user} onClose={() => setOpen(false)} />}
    </>
  );
}

/** Mounted fresh on every open, so the form state starts clean each time. */
function PasswordDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [state, action] = useActionState<PasswordState, FormData>(setUserPassword, {});

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-void/80 p-4 backdrop-blur-sm" onClick={() => onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Change password" className="toast-in hud cut w-full max-w-sm border border-neon/50 bg-panel p-6 text-left" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-sm font-black uppercase tracking-[0.15em]">
          {user.registered ? "Change" : "Set"} <span className="text-neon">password</span>
        </h2>
        <p className="mt-1 truncate text-sm text-ink-dim">{user.name} · {user.email}</p>

        {state.ok ? (
          <>
            <p className="mt-5 border border-ok/50 bg-ok/10 p-3 text-sm text-ok">✓ Password updated. They can log in with it now.</p>
            <button type="button" className="btn-neon cut-sm mt-5 w-full" onClick={() => onClose()}>Done</button>
          </>
        ) : (
          <form action={action} className="mt-5 space-y-4">
            <input type="hidden" name="id" value={user.id} />
            <label className="block"><span className="label">New password</span><PasswordInput name="password" minLength={8} required autoComplete="new-password" autoFocus /></label>
            <label className="block"><span className="label">Confirm password</span><PasswordInput name="confirm" minLength={8} required autoComplete="new-password" /></label>
            {state.error && <p className="text-sm text-danger">{state.error}</p>}
            <div className="flex gap-3">
              <SubmitButton className="btn-volt flex-1" loadingText="Encrypting">Save</SubmitButton>
              <button type="button" className="btn-neon cut-sm" onClick={() => onClose()}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
