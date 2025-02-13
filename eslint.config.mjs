/**
 * Copyright 2025 Daniel Perez Alvarez
 *
 * This file is part of Astro Feeds.
 *
 * Astro Feeds is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * Astro Feeds is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Astro Feeds. If not, see <https://www.gnu.org/licenses/>.
 */

// @ts-check
/* eslint-disable @typescript-eslint/naming-convention */

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginLicenseHeader from "eslint-plugin-license-header";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".astro/"] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs["jsx-a11y-recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // eslint rules:
      curly: "error",
      "default-case": "error",
      "default-case-last": "error",
      eqeqeq: "error",
      "new-cap": "error",
      "no-await-in-loop": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": "error",
      "no-return-assign": "error",
      "no-unneeded-ternary": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "object-shorthand": "error",
      "operator-assignment": "error",
      "prefer-template": "error",
      "require-unicode-regexp": "error",
      // typescript-eslint rules:
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/naming-convention": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-parameter-property-assignment":
        "error",
      "@typescript-eslint/no-unsafe-type-assertion": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },
  {
    plugins: {
      "license-header": eslintPluginLicenseHeader,
    },
    rules: {
      "license-header/header": [
        "warn",
        [
          `/**`,
          ` * Copyright ${new Date().getFullYear().toString(10)} Daniel Perez Alvarez`,
          ` *`,
          ` * This file is part of Astro Feeds.`,
          ` *`,
          ` * Astro Feeds is free software: you can redistribute it and/or modify it under`,
          ` * the terms of the GNU Affero General Public License as published by the Free`,
          ` * Software Foundation, either version 3 of the License, or (at your option) any`,
          ` * later version.`,
          ` *`,
          ` * Astro Feeds is distributed in the hope that it will be useful, but WITHOUT`,
          ` * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS`,
          ` * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more`,
          ` * details.`,
          ` *`,
          ` * You should have received a copy of the GNU Affero General Public License`,
          ` * along with Astro Feeds. If not, see <https://www.gnu.org/licenses/>.`,
          ` */`,
        ],
      ],
    },
  },
  {
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
);
