import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import importPlugin from 'eslint-plugin-import';

export default tseslint
  .config(
    {
      ignores: [
        'dist',
        'node_modules',
        'env',
        '.eslintcache',
        '*.log',
        '*.cache',
        'src/components/ui',
        'src/hooks',
        'src/lib',
      ],
    },
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        importPlugin.flatConfigs.recommended,
        eslintConfigPrettier, // Add prettier rules to eslint
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        promise: pluginPromise,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
        // General rules
        'no-console': 'warn',
        'no-debugger': 'off',
        'no-unused-vars': 'off', //using "@typescript-eslint/no-unused-vars"
        'no-undef': 'off',
        'no-template-curly-in-string': 'warn',
        'consistent-return': 'warn',
        'array-callback-return': 'warn',
        'no-eq-null': 'error',
        'no-extend-native': 'warn',
        'no-throw-literal': 'error',
        'no-await-in-loop': 'warn', // must fix .\src\tags\service.ts and set to error
        'no-compare-neg-zero': 'error',
        'no-shadow-restricted-names': 'error',
        'no-catch-shadow': 'error',
        'callback-return': 'error',
        'handle-callback-err': 'error',
        'prefer-arrow-callback': 'warn',
        'getter-return': 'error',
        'prefer-promise-reject-errors': 'error',
        'no-new-wrappers': 'warn',
        'no-new-func': 'error',
        'no-loop-func': 'warn',
        'no-prototype-builtins': 'warn',

        // TypeScript-specific rules
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'warn', // TODO: set to error

        // Promise rules
        'promise/always-return': 'error',
        'promise/catch-or-return': 'error',
        'promise/no-nesting': 'warn',

        // Import rules
        'import/order': [
          'warn',
          {
            groups: ['builtin', 'external', 'internal'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
        'no-duplicate-imports': 'error',

        // Prettier integration
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
      },
      settings: {
        // Agrega el resolver para TypeScript
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true, // Intenta resolver tipos siempre
          },
        },
      },
    },
  )
  .concat(eslintPluginPrettierRecommended);
