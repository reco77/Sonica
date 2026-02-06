import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ComparisonTray } from "@/components/products/ComparisonTray";

export const metadata: Metadata = {
  title: "Sonica — Premium Tech Accessories",
  description:
    "Discover premium headphones, smartwatches, earbuds, and speakers from top brands. Sonica curates the best tech accessories for your lifestyle.",
  keywords: [
    "tech accessories",
    "headphones",
    "smartwatches",
    "earbuds",
    "speakers",
    "premium audio",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ComparisonTray />
        </Providers>
      </body>
    </html>
  );
}
