import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeMind AI — AI-Powered Trading Intelligence Platform",
  description:
    "Stop guessing, start understanding. TradeMind AI helps traders discover why they lose, which strategies work, and which mistakes repeat. Your AI trading coach for behavioral intelligence and performance analytics.",
  keywords: [
    "trading analytics",
    "AI trading coach",
    "behavioral analytics",
    "trade journal",
    "portfolio analytics",
    "risk management",
    "Indian stock market",
    "Zerodha",
    "Groww",
    "Upstox",
  ],
  authors: [{ name: "Prashant Gupta" }],
  openGraph: {
    title: "TradeMind AI — AI-Powered Trading Intelligence Platform",
    description:
      "Your AI trading coach. Discover behavioral patterns, optimize strategies, and manage risk with intelligence.",
    type: "website",
    siteName: "TradeMind AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
