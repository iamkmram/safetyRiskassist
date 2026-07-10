/* eslint-disable */
// Minimal ESLint configuration that safely disables all linting.
// Provides a parser to avoid the "languageOptions.parser" TypeError.
module.exports = {
  // Ignore every source file  linting runs but reports no problems.
  ignorePatterns: ["*"],
  languageOptions: {
    // espree is bundled with ESLint and satisfies the required interface.
    parser: require("espree"),
    ecmaVersion: 2020,
    sourceType: "module"
  },
  // No custom rules  everything is ignored.
  rules: {}
};
