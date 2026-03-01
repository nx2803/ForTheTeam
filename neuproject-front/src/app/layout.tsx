import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "For The Team | Premium Sports Calendar",
  description: "Experience your favorite sports schedule with high-performance visualization and real-time updates.",
};

import { ThemeInitializer } from "@/providers/ThemeInitializer";
import { QueryProvider } from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased bg-[#0a0a0a] text-white h-screen overflow-hidden selection:bg-red-500 selection:text-white`}
      >
        <QueryProvider>
          <ThemeInitializer />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
