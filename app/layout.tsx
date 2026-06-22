import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Observation Ready AI — Educator Planning Tools",
  description:
    "AI-powered lesson planning and IPDP tools for K–12 educators. Build observation-ready lesson plans, craft professional IPDP responses, and manage your standards — all in one place.",
  keywords: ["lesson plan", "IPDP", "teacher tools", "AI lesson planner", "educator", "observation ready", "professional development"],
  authors: [{ name: "Tamand Inc." }],
  creator: "Tamand Inc.",
  applicationName: "Observation Ready AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ObsReady AI",
    startupImage: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Observation Ready AI",
    description:
      "AI-powered educator toolkit — build observation-ready lesson plans and craft professional IPDP responses in minutes.",
    url: "https://observationreadyai.app",
    siteName: "Observation Ready AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Observation Ready AI",
    description:
      "AI-powered educator toolkit — build observation-ready lesson plans and craft professional IPDP responses in minutes.",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Inline SW registration — runs before React hydrates so crawlers see it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.error('SW error:', err); });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
