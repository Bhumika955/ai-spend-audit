import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit — Free Tool to Cut AI Tool Costs",
  description:
    "Free 60-second audit of your team's AI spend. See exactly where you're wasting money and what to do about it.",
  openGraph: {
    title: "AI Spend Audit — Are you overpaying for AI tools?",
    description:
      "Free audit of your AI tool spend. Identify overspending in 60 seconds.",
     url: "https://ai-spend-audit.vercel.app",
    siteName: "AI Spend Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit",
    description: "Find out if you're overpaying for AI tools. Free, instant audit.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}