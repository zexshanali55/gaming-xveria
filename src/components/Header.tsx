"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/components/CartProvider";

const NAV = [
  { href: "/games", label: "All Games" },
  { href: "/games?edition=DIGITAL", label: "PC Keys" },
  { href: "/games?edition=PHYSICAL", label: "Discs" },
  { href: "/games?genre=Racing", label: "Racing" },
];

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/85 backdrop-blur-md">
      <div className="overflow-hidden border-b border-line bg-volt text-void">
        <div className="marquee flex w-max gap-10 whitespace-nowrap py-1 font-display text-[0.62rem] font-bold uppercase tracking-[0.25em]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-10">
              <span>⚡ PC keys emailed instantly after payment</span>
              <span>◆ PS5 &amp; Xbox discs delivered nationwide</span>
              <span>⚡ Secure checkout by PayFast</span>
              <span>◆ Use code NITRO10 for 10% off</span>
            </span>
          ))}
        </div>
      </div>
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-neon"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/account" className="hidden px-3 py-2 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-dim hover:text-neon sm:block">
            Account
          </Link>
          <Link href="/cart" className="btn-neon cut-sm !px-4 !py-2.5" aria-label={`Cart, ${count} items`}>
            Cart
            <span className="grid h-5 min-w-5 place-items-center bg-volt px-1 text-[0.65rem] text-void">
              {ready ? count : 0}
            </span>
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-line md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="font-display text-neon">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="shell flex flex-col gap-1 border-t border-line pb-4 md:hidden">
          {[...NAV, { href: "/account", label: "Account" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim hover:text-neon"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
