import React from "react";

import { GeistSans } from "geist/font/sans";
import { ViewTransitions } from "next-view-transitions";
import { JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "@/styles/globals.css";
import "@/styles/highlight.css";

import { RootProvider } from "@/components/providers/root-provider";
import { host } from "@/constants";
import { cn } from "@/lib/utils";
import Script from "next/script";

const fontMono = JetBrains_Mono({
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
      url: host,
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
            GeistSans.variable,
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
