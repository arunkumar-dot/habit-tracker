import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    // Tell Turbopack (and webpack) to only bundle the specific exports actually
    // imported from these large packages, instead of the entire library.
    // Primary impact is faster cold-start compilation in `npm run dev`.
    //
    // lucide-react ships ~1,500 icons. Without this, visiting any page that
    // imports even one icon forces the bundler to process all 1,500.
    // recharts and framer-motion have similar barrel-export problems.
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "arun-projects",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Delete .map files from the client bundle after uploading to Sentry so they
  // are not served to users (replaces the deprecated `hideSourceMaps` option).
  sourcemaps: {
    filesToDeleteAfterUpload: [".next/static/**/*.map"],
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
