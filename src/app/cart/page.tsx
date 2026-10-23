import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { getShippingFee } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  return <CartView shippingFee={await getShippingFee()} />;
}
