"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Small "added to cart" popup, bottom centre — sits above the phone tab bar. */
export function CartToast({ title, image, count, onClose }: { title: string; image: string; count: number; onClose: () => void }) {
  const pathname = usePathname();
  if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) return null;

  return (
    <div
      role="status"
      className="toast-in fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[60] mx-auto flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 border border-neon/60 bg-void/95 p-2.5 shadow-[0_0_30px_-6px_rgb(0_194_255/.6)] md:bottom-6"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="h-10 w-20 shrink-0 object-cover" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-[0.55rem] font-bold uppercase tracking-[0.2em] text-ok">✓ Added to cart</p>
        <p className="truncate text-sm font-semibold">{title}</p>
      </div>
      <Link href="/cart" onClick={onClose} className="btn-volt shrink-0 !px-3 !py-2 !text-[0.65rem]">
        View cart ({count})
      </Link>
    </div>
  );
}
