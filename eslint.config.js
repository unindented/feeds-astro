import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{astro,cjs,js,mjs,ts}"] },
  { languageOptions: { globals: { ...globals.browser } } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...eslintPluginAstro.configs.all,
];
