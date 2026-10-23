import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { ButtonGlitch } from "@/components/Buttons";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { siteOrigin } from "@/lib/site-url";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", weight: ["700", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], variable: "--font-rajdhani", weight: ["400", "600", "700"] });

const description = "Instant PC keys & original PS5/Xbox discs across Pakistan. Pay securely with PayFast.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: "Gaming Xveria — Games at Full Throttle", template: "%s · Gaming Xveria" },
  description,
  applicationName: "Gaming Xveria",
  keywords: ["game store Pakistan", "PC game keys", "PS5 games", "Xbox games", "buy games online Pakistan"],
  openGraph: { type: "website", siteName: "Gaming Xveria", title: "Gaming Xveria — Games at Full Throttle", description, locale: "en_PK" },
  twitter: { card: "summary_large_image", title: "Gaming Xveria — Games at Full Throttle", description },
  appleWebApp: { title: "Xveria", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#04060d", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <head>
        {/* All cover art comes from Steam's CDN — open the connection early. */}
        <link rel="preconnect" href="https://shared.akamai.steamstatic.com" crossOrigin="" />
      </head>
      <body className="flex min-h-screen flex-col">
        <ButtonGlitch />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
