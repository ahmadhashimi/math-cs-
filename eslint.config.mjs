import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Course content, kept verbatim from the design bundle. It is data rather
    // than application code, and it is checked by `npm run audit` instead —
    // which tests what actually matters about it (answer indices in range,
    // every track's exam pool non-empty, every generator able to fill a set).
    "src/data/*.js",
  ]),
]);

export default eslintConfig;
