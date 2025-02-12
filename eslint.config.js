import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{astro,cjs,js,mjs,ts}"] },
  { languageOptions: { globals: { ...globals.browser } } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...eslintPluginAstro.configs.all,
  {
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];
