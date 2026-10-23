import Link from "next/link";
import { Glitch } from "@/components/Glitch";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`} aria-label="Gaming Xveria home">
      <span className="cut-sm grid h-9 w-9 place-items-center bg-volt font-display text-lg font-black text-void transition-shadow group-hover:shadow-[0_0_20px_rgb(255_229_0/.7)]">
        X
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-black tracking-[0.18em] text-ink"><Glitch text="XVERIA" auto /></span>
        <span className="block font-display text-[0.55rem] tracking-[0.42em] text-neon">GAMING STORE</span>
      </span>
    </Link>
  );
}
