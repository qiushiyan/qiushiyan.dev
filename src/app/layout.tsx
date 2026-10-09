import React from "react";
import { JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { ViewTransitions } from "next-view-transitions";

import "@/styles/globals.css";
import "@/styles/highlight.css";

import Script from "next/script";

import { GoogleAnalytics } from "@/components/google-analytics";
import { RootProvider } from "@/components/providers/root-provider";
import { host } from "@/constants";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(host),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        className={cn(GeistSans.variable, fontMono.variable)}
        suppressHydrationWarning
      >
        <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
          <RootProvider>{children}</RootProvider>
          <CloudflareAnalytics />
          <GoogleAnalytics />
        </body>
      </html>
    </ViewTransitions>
  );
}

const CloudflareAnalytics = () => {
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "ebc8e642434a45cd9fcb862ef2d97a67"}'
    />
  );
};
