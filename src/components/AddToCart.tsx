"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, type CartLine } from "@/components/CartProvider";

export function AddToCart({ product, disabled }: { product: Omit<CartLine, "quantity">; disabled?: boolean }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  if (disabled) return <button className="btn-volt w-full" disabled>Sold out</button>;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        className="btn-volt flex-1"
        onClick={() => {
          add(product);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "✓ Added to cart" : "Add to cart"}
      </button>
      <button
        type="button"
        className="btn-neon cut-sm flex-1"
        onClick={() => {
          add(product, 1, { silent: true });
          router.push("/checkout");
        }}
      >
        Buy now
      </button>
    </div>
  );
}
