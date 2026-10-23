"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * The futuristic in-button loader: the label goes invisible (so the button
 * keeps its width) and an overlay shows equaliser bars + glitching text over
 * moving hazard stripes (see .btn-loading in globals.css).
 */
export function BtnLoader({ text }: { text?: string }) {
  return (
    <span className="btn-loader" aria-hidden>
      <span className="btn-bars"><i /><i /><i /><i /><i /></span>
      {text && <span className="glitch-text glitch-fast" data-text={text}>{text}</span>}
    </span>
  );
}

/** Puts a button into the loading state while `loading` is true. */
export function LoadingLabel({ loading, text = "Processing", children }: { loading: boolean; text?: string; children: React.ReactNode }) {
  return (
    <>
      <span className={loading ? "invisible" : "contents"}>{children}</span>
      {loading && <BtnLoader text={text} />}
    </>
  );
}

/** Submit button for server-action forms: shows the loader while the action runs. */
export function SubmitButton({
  children,
  className = "btn-volt",
  loadingText,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loadingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button {...props} className={className} disabled={pending || props.disabled} data-loading={pending || undefined} aria-busy={pending}>
      <LoadingLabel loading={pending} text={loadingText}>{children}</LoadingLabel>
    </button>
  );
}

/** Password field with a show/hide eye toggle. */
export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <input {...props} type={visible ? "text" : "password"} className={`field pr-12 ${props.className ?? ""}`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-dim transition-colors hover:text-neon"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3l18 18M10.6 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7a9.8 9.8 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
        )}
      </button>
    </span>
  );
}

/**
 * Gives every .btn-volt / .btn-neon the nav's glitch hover without touching
 * each button: on hover, the button's current text is copied into data-text,
 * which the ::before glitch layer in globals.css renders. Mounted once.
 */
export function ButtonGlitch() {
  useEffect(() => {
    const onOver = (event: PointerEvent) => {
      const button = (event.target as Element | null)?.closest?.(".btn-volt, .btn-neon");
      if (button instanceof HTMLElement) button.dataset.text = button.textContent?.trim() ?? "";
    };
    document.addEventListener("pointerover", onOver);
    return () => document.removeEventListener("pointerover", onOver);
  }, []);
  return null;
}
