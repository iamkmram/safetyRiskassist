/**
 * ESLint flat config  ignore backend TypeScript files.
 * This satisfies the new ESLint requirement that .eslintignore is deprecated.
 */
module.exports = [
  {
    // Ignore everything under src/backend (including functions, shared, etc.)
    ignores: ["src/backend/**"],
  },
];
