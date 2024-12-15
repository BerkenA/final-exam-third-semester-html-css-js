import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
  },
];
