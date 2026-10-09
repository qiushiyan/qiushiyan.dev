import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next dev` would otherwise append a managed agent-rules block to CLAUDE.md
  agentRules: false,
  images: {
    // Hosts of remote images in content/ (rendered through next/image)
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "web.dev" },
    ],
  },
  experimental: {
    // lucide-react is optimized by default
    optimizePackageImports: ["@icons-pack/react-simple-icons"],
  },
  // OpenNext applies these to every response the Worker serves. Files in
  // public/ and _next/static skip the Worker; their headers go in public/_headers.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

/**
 * Build content with Velite before Next.js starts. Next 16 loads this file
 * inside the dev server process, so `process.argv` no longer says "dev";
 * the phase argument is the reliable signal.
 *
 * @param {string} phase
 */
export default async function config(phase) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isBuild = phase === PHASE_PRODUCTION_BUILD;
  if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = "1";
    const { build } = await import("velite");
    await build({ watch: isDev, clean: !isDev });
  }
  return nextConfig;
}

initOpenNextCloudflareForDev();
