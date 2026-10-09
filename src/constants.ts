import { siteConfig } from "@/lib/site";

export const isProduction = process.env.NODE_ENV === "production";
export const host = isProduction
  ? siteConfig.url
  : `http://localhost:${process.env.PORT ?? 3000}`;
export const MAIN_CONTENT_ID = "main-content";
