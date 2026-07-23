import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const typescriptFiles = ['**/*.{ts,tsx}'];
const sourceFiles = ['src/**/*.{ts,tsx}'];
const testFiles = [
  'src/**/*.{test,spec}.{ts,tsx}',
  'src/**/__mocks__/**/*.{ts,tsx}',
  'src/setupTests.ts',
];

export default tseslint.config(
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  {
    ...react.configs.flat.recommended,
    files: sourceFiles,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ...react.configs.flat['jsx-runtime'],
    files: sourceFiles,
  },
  {
    files: sourceFiles,
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: jsxA11y.configs.recommended.rules,
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: sourceFiles,
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ...reactRefresh.configs.vite,
    files: ['src/**/*.tsx'],
    rules: {
      ...reactRefresh.configs.vite.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['useContragents'] },
      ],
    },
  },
  {
    files: testFiles,
    languageOptions: {
      globals: globals.jest,
    },
  },
  prettier,
);
