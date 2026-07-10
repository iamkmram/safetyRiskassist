/* eslint-disable */
// ESLint flat config merging backend TypeScript linting and frontend JS ignore rules

module.exports = [
  {
    // Target backend TypeScript source files
    files: ["backend/**/*.ts", "backend/**/*.tsx"],
    // Do not ignore any files for backend linting
    ignores: [],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./backend/tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    // Example rule set – feel free to extend
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Ignore all .js files inside src/frontend/src (they contain JSX)
    ignores: ["src/frontend/src/**/*.js"],
  },
  {
    // Ignore everything under src/backend (including functions, shared, etc.)
    ignores: ["src/backend/**"],
  },
];
