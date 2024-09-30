import baseConfig, { restrictEnvAccess } from "@mott/eslint-config/base";
import nextjsConfig from "@mott/eslint-config/nextjs";
import reactConfig from "@mott/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
