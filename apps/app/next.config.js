import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await createJiti(fileURLToPath(import.meta.url)).import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  poweredByHeader: false,
  reactStrictMode: false,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@mott/api",
    "@mott/auth",
    "@mott/db",
    "@mott/ui",
    "@mott/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
