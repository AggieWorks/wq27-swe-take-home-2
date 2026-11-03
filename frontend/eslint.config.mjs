import { FlatCompat } from "@eslint/eslintrc";
import vitest from "@vitest/eslint-plugin";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/typescript", "next/core-web-vitals", "prettier"],
    plugins: ["simple-import-sort", "@vitest"],
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      ...vitest.configs["legacy-recommended"].rules,
    },
  }),
];

export default eslintConfig;
