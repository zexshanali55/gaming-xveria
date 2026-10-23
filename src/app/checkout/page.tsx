import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { currentUser } from "@/lib/auth";
import { getPaymentText, getShippingFee } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [user, payment, shippingFee, params] = await Promise.all([currentUser(), getPaymentText(), getShippingFee(), searchParams]);
  return (
    <div className="shell py-6 sm:py-12">
      <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-volt">{"// "}Final lap</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">Checkout</h1>
      {params.error && (
        <p className="mt-6 border border-danger/50 bg-danger/10 p-4 text-danger">We could not match that payment to an order. Please try again.</p>
      )}
      <CheckoutForm payment={payment} shippingFee={shippingFee} user={user ? { name: user.name, email: user.email, phone: user.phone ?? "" } : null} />
    </div>
  );
}
