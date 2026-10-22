import { PolicyPage } from "@/components/PolicyPage";
import { site } from "@/data/site";

export const metadata = { title: "Contact us" };

export default function Contact() {
  return (
    <PolicyPage kicker="Get in touch" title="Contact us">
      <p>Questions about an order, a key that won&apos;t activate, or a delivery? We reply within one working day.</p>
      <ul>
        <li>Email: <b>{site.email}</b></li>
        <li>Phone / WhatsApp: <b>{site.phone}</b></li>
        <li>Address: <b>{site.address}</b></li>
        <li>Support hours: <b>{site.hours}</b></li>
      </ul>
      <p>Please include your order number (e.g. GX-1001-AB12) so we can help faster.</p>
    </PolicyPage>
  );
}
