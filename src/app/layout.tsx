import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* ── Font: Inter with specified weights ────────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* ── SEO Metadata ──────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Filtrona Academy — Learn how the world filters.",
  description:
    "An interactive induction experience for Filtrona's people. Built around how you actually learn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.setAttribute('data-theme', 'light');
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
