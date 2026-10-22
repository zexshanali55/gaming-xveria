import { PolicyPage } from "@/components/PolicyPage";
import { site } from "@/data/site";

export const metadata = { title: "Terms & conditions" };

export default function Terms() {
  return (
    <PolicyPage kicker="Legal" title="Terms & conditions">
      <p>By using {site.name} and placing an order you agree to these terms.</p>
      <h2>Products</h2>
      <p><b>Digital games</b> are delivered as an activation key and download link sent to the email address given at checkout. <b>Physical games</b> are sealed original discs shipped to the address given at checkout.</p>
      <h2>Prices &amp; payment</h2>
      <p>All prices are in Pakistani Rupees (PKR) and include applicable taxes. Payment is taken in full at checkout through PayFast. An order is confirmed only once PayFast confirms the payment.</p>
      <h2>Delivery</h2>
      <p>Digital keys are emailed after payment confirmation, usually within minutes and always within 24 hours. Physical discs are dispatched within 24 hours and arrive in 2–5 working days.</p>
      <h2>Account</h2>
      <p>You are responsible for keeping your login details safe and for the accuracy of the email and address you give us.</p>
      <h2>Trademarks</h2>
      <p>All game titles, artwork and trademarks belong to their respective owners and are used only to identify the products sold.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Pakistan.</p>
    </PolicyPage>
  );
}
