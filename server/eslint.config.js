const js = require("@eslint/js");
const globals = require("globals");
const prettier = require("eslint-config-prettier");

module.exports = [
  {ignores: ["coverage/**", "node_modules/**", "prisma/migrations/**"]},
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {...globals.node}
    },
    rules: {
      "no-unused-vars": ["warn", {argsIgnorePattern: "^_"}]
    }
  },
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {...globals.jest}
    }
  },
  prettier
];
