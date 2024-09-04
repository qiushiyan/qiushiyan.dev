// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    GITHUB_TOKEN: z.string(),
    DB_LOCAL_PATH: z.string().optional(),
    CF_ACCOUNT_ID: z.string().optional(),
    CF_USER_API_TOKEN: z.string().optional(),
    DB_PROD_DATABASE_ID: z.string().optional(),
    DB_PREVIEW_DATABASE_ID: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "preview", "production"])
      .default("development"),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {},
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  runtimeEnv: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    DB_LOCAL_PATH: process.env.DB_LOCAL_PATH,
    DB_PROD_DATABASE_ID: process.env.DB_PROD_DATABASE_ID,
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    CF_USER_API_TOKEN: process.env.CF_USER_API_TOKEN,
    DB_PREVIEW_DATABASE_ID: process.env.DB_PREVIEW_DATABASE_ID,
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});
