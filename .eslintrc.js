/* eslint-disable */
module.exports = {
  parser: '@typescript-eslint/parser',
  ignorePatterns: ["src/frontend/**"],

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // Projectspecific overrides can be added here
  },
};
