import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "./sidebar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Sonica Admin",
  description: "Admin dashboard for Sonica tech accessories e-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
