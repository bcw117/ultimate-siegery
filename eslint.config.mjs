import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores - these files will be completely ignored by ESLint
  {
    ignores: [
      "**/src/db/schema.ts",
      "**/src/db/**/*",
      "**/*.generated.ts",
      "src/db/0000_*.sql",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;
