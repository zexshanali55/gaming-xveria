import { PolicyPage } from "@/components/PolicyPage";

export const metadata = { title: "Shipping & delivery" };

export default function Shipping() {
  return (
    <PolicyPage kicker="Delivery" title="Shipping & delivery">
      <h2>Digital games</h2>
      <p>⚡ No shipping. Your activation key and download link are sent to your email after PayFast confirms payment — usually within minutes, at most 24 hours. Free.</p>
      <h2>Physical discs</h2>
      <p>◆ Flat <b>Rs 350</b> delivery anywhere in Pakistan. Dispatched within 24 hours; delivered in 2–5 working days. You&apos;ll get a tracking number by email.</p>
    </PolicyPage>
  );
}
