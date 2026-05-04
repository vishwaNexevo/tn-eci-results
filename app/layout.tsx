import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamil Nadu Assembly Election Results 2026 — Live",
  description:
    "Live constituency-wise Tamil Nadu Assembly Election Results 2026 with party-wise breakdown, filters, and real-time updates from the Election Commission of India.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
