"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { site } from "@/data/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-line bg-panel/60">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-ink-dim">
            Next-gen games at full throttle. PC keys by email, PS5 &amp; Xbox discs to your door.
          </p>
        </div>
        <div>
          <h3 className="label">Shop</h3>
          <ul className="space-y-2 text-ink-dim">
            <li><Link className="hover:text-neon" href="/games">All games</Link></li>
            <li><Link className="hover:text-neon" href="/games?edition=DIGITAL">PC digital keys</Link></li>
            <li><Link className="hover:text-neon" href="/games?edition=PHYSICAL">Physical discs</Link></li>
            <li><Link className="hover:text-neon" href="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="label">Policies</h3>
          <ul className="space-y-2 text-ink-dim">
            <li><Link className="hover:text-neon" href="/about">About us</Link></li>
            <li><Link className="hover:text-neon" href="/terms">Terms &amp; conditions</Link></li>
            <li><Link className="hover:text-neon" href="/privacy">Privacy policy</Link></li>
            <li><Link className="hover:text-neon" href="/refund-policy">Refund &amp; return policy</Link></li>
            <li><Link className="hover:text-neon" href="/shipping">Shipping &amp; delivery</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="label">Contact</h3>
          <ul className="space-y-2 text-ink-dim">
            <li><Link className="hover:text-neon" href="/contact">Contact us</Link></li>
            <li>{site.email}</li>
            <li>{site.address}</li>
          </ul>
          <div className="mt-5 inline-flex items-center gap-2 border border-line px-3 py-2">
            <span className="font-display text-[0.6rem] tracking-[0.2em] text-ink-dim">SECURED BY</span>
            <span className="font-display text-sm font-black text-neon">PayFast</span>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center font-display text-[0.6rem] tracking-[0.25em] text-ink-dim">
        © {new Date().getFullYear()} {site.name.toUpperCase()} · ALL TRADEMARKS BELONG TO THEIR OWNERS
      </div>
    </footer>
  );
}
