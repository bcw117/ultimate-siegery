import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "**/src/lib/db/schema.ts",
    "**/src/lib/db/**/*",
    "**/*.generated.ts",
    "src/lib/db/0000_*.sql",
  ]),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { rules: { "prefer-const": "off" } },
]);

export default eslintConfig;
