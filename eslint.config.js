import tsParser from '@typescript-eslint/parser';

export default [
  {
    // Apply to all JavaScript/TypeScript source files
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      // Define globals here if needed, e.g.:
      // globals: { process: 'readonly', __dirname: 'readonly' },
    },
    // No \"env\" key  flat config uses languageOptions.globals instead
    // You can extend recommended rules via plugins; keeping it minimal here
    rules: {
      // Example: enforce semicolons
      // 'semi': ['error', 'always'],
    },
  },
];
