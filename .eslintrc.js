/* eslint-disable */
module.exports = {
  root: true,
  ignorePatterns: ["*", "src/frontend/**", "src/frontend/src/**"],
  env: {
    browser: true,
    node: true,
    es6: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  languageOptions: {
    parser: require("espree"),
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    // Projectspecific overrides can be added here
  },
};
