import type { NextConfig } from "next";

// Read version from package.json at build time
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require("./package.json") as { version?: string };
const appVersion = pkg.version ?? (() => {
  console.warn(
    "[next.config.ts] WARNING: package.json is missing a `version` field. " +
      "Falling back to '0.0.0'. Add `\"version\": \"0.1.0\"` to package.json."
  );
  return "0.0.0";
})();

const buildDate = new Date().toISOString().slice(0, 10);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
};

export default nextConfig;
