import confusingBrowserGlobals from 'confusing-browser-globals';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import jsxRuntimConfig from 'eslint-plugin-react/configs/jsx-runtime.js';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import importPluginTypescriptConfig from 'eslint-plugin-import/config/typescript.js';
import path from 'path';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  {
    ignores: [
      '**/legacy',
      '**/modern',
      '**/dist',
      '**/coverage',
      '**/node_modules',
      '**/.next',
      '**/out',
      'packages/icons/src',
      'packages/icons/third',
      'packages/icons/scripts/template',
    ],
  },
  ...compat.extends('airbnb', 'airbnb/hooks'),
  jsxRuntimConfig,
  prettierRecommendedConfig,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.es2016,
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2018,
        requireConfigFile: false,
        babelOptions: {
          plugins: [],
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['packages/*/tsconfig.json', 'platforms/*/tsconfig.json'],
        },
      },
    },
    plugins: {
      unicorn,
      import: importPlugin,
    },
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          // packageDir: __dirname,
          devDependencies: ['scripts/**', './*.js', './*.mjs'],
        },
      ],
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */,
          },
          groups: [['builtin', 'external'], 'internal'],
        },
      ],
      // Strict, airbnb is using warn; allow warn and error for dev environments
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'nonblock-statement-body-position': 'error',
      'no-plusplus': 'off',
      'no-param-reassign': 'off',
      'no-restricted-globals': ['error'].concat(confusingBrowserGlobals),
      'no-underscore-dangle': 'off',
      'no-nested-ternary': 'off',
      'no-use-before-define': 'off',
      'no-multi-assign': 'off',
      'no-continue': 'off',
      'consistent-return': [
        'off',
        {
          treatUndefinedAsUnspecified: true,
        },
      ],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': [
        'error',
        {
          // custom hooks
          additionalHooks: '(useIsomorphicLayoutEffect|useEnhancedMemo)',
        },
      ],
      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
          checkLocalVariables: true,
        },
      ],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/forbid-prop-types': 'error',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/display-name': 'error',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
          callbacksLast: true,
        },
      ],
      'react/sort-prop-types': [
        'error',
        {
          ignoreCase: true,
          requiredFirst: true,
          sortShapeProp: true,
          callbacksLast: true,
        },
      ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { object: true, array: false },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: [/^.*\.config\.js$/, /^en-US\.ts$/, /^zh-CN\.ts$/],
        },
      ],
      'unicorn/better-regex': 'error',
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/import-index': 'error',
      // forbid passing object as default value to props of function component
      // 'unicorn/no-object-as-default-parameter': 'error',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/no-abusive-eslint-disable': 'error',
    },
  },
  ...[...tseslint.configs.recommendedTypeChecked, importPluginTypescriptConfig].map((it) => ({
    ...it,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      'no-shadow': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          mjs: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-cycle': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
        },
      ],
      // '@typescript-eslint/member-ordering': [
      //   'error',
      //   {
      //     default: {
      //       memberTypes: ['signature', 'constructor', 'field', 'method'],
      //       optionalityOrder: 'required-first',
      //       order: 'alphabetically-case-insensitive',
      //     },
      //   },
      // ],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-function': 'error',
    },
  },
  // {
  //   files: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
  //   rules: {
  //     // 'import/no-unresolved': [
  //     //   'error',
  //     //   {
  //     //     ignore: ['^react', '^react-dom'],
  //     //   },
  //     // ],
  //   },
  // },
  {
    files: [
      'test/utils/**',
      'test/__test__/**',
      'packages/**/__test__/**',
      'packages/**/__doc__/**',
      'platforms/**',
    ],
    rules: {
      'react/jsx-handler-names': 'off',
      'react/display-name': 'off',
      'react/button-has-type': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'import/no-relative-packages': 'off',
      'react/forbid-prop-types': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  {
    files: ['packages/**/__doc__/**'],
    rules: {
      'no-console': 'off',
    },
  },
];
