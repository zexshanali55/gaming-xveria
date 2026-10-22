import { PolicyPage } from "@/components/PolicyPage";
import { site } from "@/data/site";

export const metadata = { title: "Privacy policy" };

export default function Privacy() {
  return (
    <PolicyPage kicker="Legal" title="Privacy policy">
      <p>We collect only what we need to deliver your order: your name, email, mobile number and, for physical discs, your delivery address.</p>
      <h2>Payments</h2>
      <p>Card, bank and wallet details are entered on PayFast&apos;s secure page and are never seen or stored by {site.name}. We receive only a transaction reference and whether the payment succeeded.</p>
      <h2>How we use your data</h2>
      <ul>
        <li>To send your game key / download link and order updates by email.</li>
        <li>To deliver physical discs through our courier partner.</li>
        <li>To answer your support requests.</li>
      </ul>
      <p>We never sell your data. Passwords are stored hashed. You can ask us to delete your account at {site.email}.</p>
    </PolicyPage>
  );
}
