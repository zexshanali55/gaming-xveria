import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", weight: ["700", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], variable: "--font-rajdhani", weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Gaming Xveria — Games, Keys & Discs in Pakistan", template: "%s · Gaming Xveria" },
  description: "Pakistan's neon-lit game store. PC keys delivered by email, PS5 and Xbox discs delivered to your door. Pay securely with PayFast.",
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
