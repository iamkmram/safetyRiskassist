/* eslint-disable */
// ESLint flat config  explicitly lint backend TypeScript files
module.exports = [
  {
    // Target backend TypeScript source files
    files: ["backend/**/*.ts", "backend/**/*.tsx"],
    // Do not ignore any files
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
    // Example rule set  feel free to extend
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn"
    },
  },
];
