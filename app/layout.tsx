import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Observation Ready AI — Educator Planning Tools",
  description:
    "AI-powered lesson planning and IPDP tools for K–12 educators. Build observation-ready lesson plans, craft professional IPDP responses, and manage your standards — all in one place.",
  keywords: ["lesson plan", "IPDP", "teacher tools", "AI lesson planner", "educator", "observation ready", "professional development"],
  authors: [{ name: "Tamand Inc." }],
  creator: "Tamand Inc.",
  openGraph: {
    title: "Observation Ready AI",
    description:
      "AI-powered educator toolkit — build observation-ready lesson plans and craft professional IPDP responses in minutes.",
    url: "https://observationreadyai.com",
    siteName: "Observation Ready AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Observation Ready AI",
    description:
      "AI-powered educator toolkit — build observation-ready lesson plans and craft professional IPDP responses in minutes.",
    creator: "@TamandInc",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
