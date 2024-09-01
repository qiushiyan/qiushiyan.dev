import React from "react";

import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import {
  Roboto_Mono as FontMono,
  Inter as FontSans,
  Space_Grotesk as FontSerif,
} from "next/font/google";

import "@/styles/globals.css";

import { RootProvider } from "@/components/providers/root-provider";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = FontSerif({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Qiushi Yan",
  description: "Qiushi Yan's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-foreground antialiased",
            fontSans.variable,
            fontHeading.variable,
            fontMono.variable
          )}
        >
          <RootProvider>{children}</RootProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
