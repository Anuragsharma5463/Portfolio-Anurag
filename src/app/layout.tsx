import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = `${portfolio.name} — AI/ML Engineer`;
const description = "AI/ML Engineer building Generative AI applications, agentic RAG systems, LLM-powered automation and computer-vision platforms.";

export const metadata: Metadata = {
  metadataBase: new URL(portfolio.siteUrl),
  title, description,
  openGraph: { title, description, type: "website", url: "/", siteName: portfolio.name },
  twitter: { card: "summary", title, description },
};
export const viewport: Viewport = { themeColor: "#050510", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain font-sans antialiased">{children}</body>
    </html>
  );
}
