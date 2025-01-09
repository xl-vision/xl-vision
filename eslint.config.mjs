import babelParser from '@babel/eslint-parser';
import { FlatCompat } from '@eslint/eslintrc';
import eslintJs from '@eslint/js';
import confusingBrowserGlobals from 'confusing-browser-globals';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * @type {import('eslint').Linter.Config[]}
 */
const baseConfig = [
  eslintJs.configs.recommended,
  unicorn.configs['flat/recommended'],
  pluginPromise.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  ...compat.config(reactHooks.configs.recommended),
  importX.flatConfigs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.es2016,
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
    },
  },
];

/**
 * @type {import('eslint').Linter.Config[]}
 */
const baseTsConfig = [
  ...tseslint.configs.recommendedTypeChecked,
  {
    settings: {
      'import-x/resolver': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['./tsconfig.json', 'packages/*/tsconfig.json', 'platforms/*/tsconfig.json'],
        }),
      ],
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  importX.flatConfigs.typescript,
].map((it) => ({
  ...it,
  files: ['**/*.{ts,tsx}'],
}));

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
  ...baseConfig,
  ...baseTsConfig,
  prettierRecommendedConfig,
  {
    rules: {
      'no-restricted-globals': ['error', ...confusingBrowserGlobals],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-await-in-loop': 'error',
      'import-x/prefer-default-export': 'error',
      'import-x/no-dynamic-require': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
        },
      ],
      'import-x/namespace': [
        'error',
        {
          allowComputed: true,
        },
      ],
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */,
          },
          groups: [['builtin', 'external'], 'internal'],
        },
      ],
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
      'unicorn/no-array-for-each': 'off',
      'unicorn/better-regex': 'error',
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/import-index': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/no-object-as-default-parameter': 'error',
      'unicorn/explicit-length-check': 'off',
      'promise/no-nesting': 'off',
      // 'import-x/no-unresolved': 'error',
      // // Strict, airbnb is using warn; allow warn and error for dev environments
      // 'no-console': ['error', { allow: ['warn', 'error'] }],
      // 'nonblock-statement-body-position': 'error',
      // 'no-plusplus': 'off',
      // 'no-param-reassign': 'off',
      // 'no-underscore-dangle': 'off',
      // 'no-nested-ternary': 'off',
      // 'no-use-before-define': 'off',
      // 'no-multi-assign': 'off',
      // 'no-continue': 'off',
      // 'consistent-return': [
      //   'off',
      //   {
      //     treatUndefinedAsUnspecified: true,
      //   },
      // ],
      // 'react/jsx-uses-react': 'off',
      // 'react/react-in-jsx-scope': 'off',
      // 'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      // 'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      // 'react/forbid-prop-types': 'error',
      // 'react/jsx-boolean-value': ['error', 'always'],
      // 'react/display-name': 'error',
      // 'react/jsx-props-no-spreading': 'off',
      // 'react/require-default-props': 'off',
      // 'react/jsx-sort-props': [
      //   'error',
      //   {
      //     ignoreCase: true,
      //     callbacksLast: true,
      //   },
      // ],
      // 'react/sort-prop-types': [
      //   'error',
      //   {
      //     ignoreCase: true,
      //     requiredFirst: true,
      //     sortShapeProp: true,
      //     callbacksLast: true,
      //   },
      // ],
      // 'prefer-destructuring': [
      //   'error',
      //   {
      //     VariableDeclarator: { object: true, array: false },
      //     AssignmentExpression: {
      //       array: false,
      //       object: false,
      //     },
      //   },
      // ],

      // // forbid passing object as default value to props of function component
      // 'unicorn/prefer-query-selector': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: false,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': 'off',
      // 'no-unused-vars': 'off',
      // 'no-unused-expressions': 'off',
      // 'no-shadow': 'off',
      // 'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      // 'import-x/no-cycle': 'off',
      // '@typescript-eslint/restrict-template-expressions': 'off',
      // '@typescript-eslint/array-type': [
      //   'error',
      //   {
      //     default: 'generic',
      //   },
      // ],
      // // '@typescript-eslint/member-ordering': [
      // //   'error',
      // //   {
      // //     default: {
      // //       memberTypes: ['signature', 'constructor', 'field', 'method'],
      // //       optionalityOrder: 'required-first',
      // //       order: 'alphabetically-case-insensitive',
      // //     },
      // //   },
      // // ],
      // '@typescript-eslint/no-unused-expressions': 'error',
      // '@typescript-eslint/no-shadow': 'error',
      // '@typescript-eslint/no-empty-object-type': 'error',
      // '@typescript-eslint/no-unsafe-function-type': 'error',
      // '@typescript-eslint/no-wrapper-object-types': 'error',
      // '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-non-null-assertion': 'off',
      // '@typescript-eslint/no-unused-vars': 'error',
      // '@typescript-eslint/no-empty-function': 'error',
    },
  },
  {
    files: ['**/scripts/**', './*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin,
      },
    },
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'import-x/no-dynamic-require': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          // packageDir: __dirname,
          devDependencies: true,
        },
      ],
    },
  },
  {
    files: ['test/**', '**/__test__/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      'global-require': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'import-x/no-dynamic-require': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['packages/*/src/**'],
    ignores: ['**/__doc__/**', '**/__test__/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // 'import-x/no-unresolved': [
      //   'error',
      //   {
      //     ignore: ['^react', '^react-dom'],
      //   },
      // ],
    },
  },
  {
    files: ['platforms/docs/src/**', '**/__doc__/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'react/display-name': 'off',
      'react/jsx-handler-names': 'off',
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
        },
      ],
      'import-x/prefer-default-export': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: ['not-found.tsx'],
        },
      ],
      // 'import-x/no-unresolved': [
      //   'error',
      //   {
      //     ignore: ['^react', '^react-dom'],
      //   },
      // ],
    },
  },

  {
    files: [
      'test/utils/**',
      'test/__test__/**',
      'packages/**/__test__/**',
      'packages/**/__doc__/**',
      'platforms/**',
    ],
    rules: {
      // 'react/display-name': 'off',
      // 'react/button-has-type': 'off',
      // 'import-x/no-unresolved': 'off',
      // 'import-x/no-extraneous-dependencies': 'off',
      // 'import-x/no-named-as-default': 'off',
      // 'unicorn/consistent-function-scoping': 'off',
      // 'import-x/no-relative-packages': 'off',
      // 'react/forbid-prop-types': 'off',
      // 'jsx-a11y/click-events-have-key-events': 'off',
      // 'jsx-a11y/no-static-element-interactions': 'off',
      // '@typescript-eslint/no-unsafe-call': 'off',
      // '@typescript-eslint/no-floating-promises': 'off',
      // '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  {
    files: ['packages/**/__doc__/**'],
    rules: {
      // 'no-console': 'off',
    },
  },
];
