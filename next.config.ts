import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep both bundlers anchored to this checkout. A separate package-lock.json
  // exists higher in the user directory and must not influence this app.
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
