import { PolicyPage } from "@/components/PolicyPage";
import { site } from "@/data/site";

export const metadata = { title: "About us" };

export default function About() {
  return (
    <PolicyPage kicker="Who we are" title="About Gaming Xveria">
      <p>{site.name} is an online video game store based in {site.address}. We sell original PC game keys (delivered by email) and sealed physical discs for PlayStation 5 and Xbox Series X (delivered to your door anywhere in Pakistan).</p>
      <p>Every key and disc we sell is sourced from authorised distributors. Payments are processed securely by <b>PayFast</b>, so your card and bank details never touch our servers.</p>
      <h2>Contact</h2>
      <p>Email: <b>{site.email}</b><br />Hours: {site.hours}</p>
    </PolicyPage>
  );
}
