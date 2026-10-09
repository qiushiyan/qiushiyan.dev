import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import astro from "eslint-plugin-astro";
import onlyWarn from "eslint-plugin-only-warn";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    // Build outputs and generated files
    "dist/",
    ".astro/",
    ".wrangler/",
    "public/",
    "worker-configuration.d.ts",
    // Quarto sources and their generated output
    "quarto-contents/",
    "content/",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // The recipe editor is the only React code
  { files: ["**/*.tsx"], ...reactHooks.configs.flat.recommended },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  // Turn off rules that conflict with Prettier
  prettier,
  {
    name: "project-custom",
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  // Report every rule as a warning
  { name: "only-warn", plugins: { onlyWarn } },
]);
