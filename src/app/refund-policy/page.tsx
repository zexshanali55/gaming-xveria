import { PolicyPage } from "@/components/PolicyPage";
import { site } from "@/data/site";

export const metadata = { title: "Refund & return policy" };

export default function Refunds() {
  return (
    <PolicyPage kicker="Legal" title="Refund & return policy">
      <h2>Digital games (keys)</h2>
      <p>Because a key can be used the moment it is revealed, digital purchases are <b>non-refundable once the key has been delivered</b>, except when the key is invalid or already used. In that case we replace the key or refund you in full.</p>
      <h2>Physical discs</h2>
      <p>Unopened discs can be returned within <b>7 days</b> of delivery for a full refund. Damaged or wrong items are replaced at no cost — please report them within 48 hours with a photo.</p>
      <h2>How refunds are paid</h2>
      <p>Approved refunds are returned to the original payment method through PayFast within 7–14 working days.</p>
      <p>To request a refund, email <b>{site.email}</b> with your order number.</p>
    </PolicyPage>
  );
}
