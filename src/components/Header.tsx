"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Glitch } from "@/components/Glitch";
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

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/95 md:bg-void/85 md:backdrop-blur-md">
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
      <div className="shell flex h-14 items-center justify-between gap-4 md:h-16">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glitch-hover glitch-host font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-dim"
            >
              <Glitch text={item.label} />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/account" className="glitch-hover glitch-host hidden px-3 py-2 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-dim md:block">
            <Glitch text="Account" />
          </Link>
          <Link href="/cart" className="btn-neon cut-sm !px-4 !py-2.5" aria-label={`Cart, ${count} items`}>
            Cart
            <span className="grid h-5 min-w-5 place-items-center bg-volt px-1 text-[0.65rem] text-void">
              {ready ? count : 0}
            </span>
          </Link>
        </div>
      </div>
      {/* Phones: categories as a swipeable chip row — one tap, no menu to open. */}
      <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 border border-line px-3 py-2 font-display text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-dim active:border-volt active:text-volt"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
