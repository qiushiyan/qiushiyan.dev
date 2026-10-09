import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered routes (pages, the feed, sitemap and Open Graph images) are
// served from Workers Static Assets instead of being rendered per request.
// Content only changes on deploy, so a read-only cache is enough, and cache
// interception answers those routes before Next.js loads.
// See https://opennext.js.org/cloudflare/caching#ssg-site
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
