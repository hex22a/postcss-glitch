import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  prettier,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'as-needed'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-param-reassign': ['error', { props: false }],

      'no-console': 'off',
      'no-debugger': 'off',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'class-methods-use-this': 'off',
      'func-names': 'off',
      'global-require': 'off',
      'new-cap': 'off',
      'max-len': 'off',
      'eol-last': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ]
    }
  },

  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
];
