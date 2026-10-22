import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", weight: ["500", "700", "800", "900"] });
const rajdhani = Rajdhani({ subsets: ["latin"], variable: "--font-rajdhani", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Gaming Xveria — Games, Keys & Discs in Pakistan", template: "%s · Gaming Xveria" },
  description: "Pakistan's neon-lit game store. PC keys delivered by email, PS5 and Xbox discs delivered to your door. Pay securely with PayFast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
