import React from "react";

import { ViewTransitions } from "next-view-transitions";
import {
  Roboto_Mono as FontMono,
  Inter as FontSans,
  Space_Grotesk as FontSerif,
} from "next/font/google";
import { Toaster } from "sonner";

import "@/styles/globals.css";
import "@/styles/highlight.css";

import { RootProvider } from "@/components/providers/root-provider";
import { host } from "@/constants";
import { cn } from "@/lib/utils";
import Script from "next/script";

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

export const generateMetadata = () => {
  return {
    title: {
      template: "%s | Qiushi Yan",
      default: "Qiushi Yan",
    },
    description: "Qiushi Yan's personal website",
    metadataBase: host,
    openGraph: {
      title: "Qiushi Yan",
      description: "Qiushi Yan's personal website",
      type: "article",
      url: host.toString(),
      images: [
        {
          url: "/api/og",
        },
      ],
    },
  };
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
            "flex min-h-screen flex-col bg-background font-sans text-foreground antialiased",
            fontSans.variable,
            fontHeading.variable,
            fontMono.variable
          )}
        >
          <Toaster visibleToasts={1} />
          <RootProvider>{children}</RootProvider>
          <CloudflareAnalytics />
        </body>
      </html>
    </ViewTransitions>
  );
}

const CloudflareAnalytics = () => {
  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "ebc8e642434a45cd9fcb862ef2d97a67"}'
    ></Script>
  );
};
