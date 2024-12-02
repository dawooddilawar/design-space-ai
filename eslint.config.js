// eslint.config.js
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import * as tseslint from 'typescript-eslint';

// Base config for all files
const baseConfig = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  ignores: ['node_modules/**', '.next/**', 'dist/**'],
  plugins: {
    '@next/next': nextPlugin,
    'react': reactPlugin,
    'react-hooks': reactHooksPlugin,
    'import': importPlugin,
  },
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    parserOptions: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};

// TypeScript specific config
const tsConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
  },
};

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  baseConfig,
  tsConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'error',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Next.js rules
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  eslintConfigPrettier,
];