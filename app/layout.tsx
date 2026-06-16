import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nomadlink — Réservations Nomades",
  description: "Réservations des nomades de l'espace de coworking Happy Hours.",
};

export const viewport: Viewport = {
  themeColor: "#f6a623",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
