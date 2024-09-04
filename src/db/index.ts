import { env } from "@/env.mjs";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export const runtime = "edge";

declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

function initDbConnection() {
  if (process.env.NODE_ENV === "development") {
    const { env } = getRequestContext();

    return drizzle(env.DB, { schema });
  }

  return drizzle(process.env.DB as unknown as D1Database, { schema });
}

export const db = initDbConnection();
