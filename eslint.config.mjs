import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import onlyWarn from "eslint-plugin-only-warn";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    // Build outputs and generated files
    ".next/",
    ".open-next/",
    ".velite/",
    ".wrangler/",
    "out/",
    "build/",
    "public/",
    "next-env.d.ts",
    "worker-configuration.d.ts",
    // Config files
    "*.config.{js,ts,mjs}",
    // Quarto sources and their generated output
    "quarto-contents/",
  ]),
  js.configs.recommended,
  // React, React Hooks, Next.js core-web-vitals, import and jsx-a11y rules
  ...nextVitals,
  // typescript-eslint recommended
  ...nextTs,
  // Turn off rules that conflict with Prettier
  prettier,
  {
    name: "project-custom",
    rules: {
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  // Report every rule as a warning
  {
    name: "only-warn",
    plugins: { onlyWarn },
  },
]);
