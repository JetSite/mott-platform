import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/app.ts", "src/app-oauth.ts"],
  format: ["cjs", "esm"],
  minify: isProduction,
  bundle: true,
});
