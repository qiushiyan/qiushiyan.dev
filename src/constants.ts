export const isProduction = process.env.NODE_ENV === "production";
export const host = isProduction
  ? new URL("https://qiushiyan.dev")
  : new URL("http://localhost:3000");
export const MAIN_CONTENT_ID = "main-content";
