"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartProvider";

const TABS = [
  { href: "/", label: "Home", icon: "⌂", match: (p: string) => p === "/" },
  { href: "/games", label: "Games", icon: "◆", match: (p: string) => p.startsWith("/games") },
  { href: "/cart", label: "Cart", icon: "▣", match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
  { href: "/account", label: "Account", icon: "◉", match: (p: string) => p.startsWith("/account") },
];

/** Thumb-reach tab bar for phones; the header nav takes over from md up. */
export function MobileNav() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-line bg-void/95 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Main"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex h-16 flex-col items-center justify-center gap-1 font-display text-[0.55rem] font-bold uppercase tracking-[0.18em] transition-colors active:scale-95 ${
              active ? "text-volt" : "text-ink-dim"
            }`}
          >
            {active && <span className="absolute inset-x-6 top-0 h-0.5 bg-volt shadow-[0_0_12px_#ffe500]" />}
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
            {tab.href === "/cart" && ready && count > 0 && (
              <span className="absolute right-[calc(50%-1.5rem)] top-2 grid h-4 min-w-4 place-items-center bg-volt px-1 text-[0.55rem] text-void">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
