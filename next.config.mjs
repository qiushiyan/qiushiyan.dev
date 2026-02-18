import { createRequire } from "module";
import path from "path";
import createMDX from "@next/mdx";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";

const require = createRequire(import.meta.url);

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

/** @type {import("codehike/mdx").CodeHikeConfig} */
const chConfig = {
  components: { code: "Code" },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    jsx: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // @code-hike/lighter is no longer needed at runtime - highlighting is pre-computed at build time
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "web.dev",
      },
      {
        protocol: "https",
        hostname: "developer.mozilla.org",
      },
    ],
  },
  experimental: {
    typedRoutes: false,
    optimizePackageImports: [
      "lucide-react",
      "@icons-pack/react-simple-icons",
    ],
  },
};

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
