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
// eslint-disable-next-line import-x/no-unresolved
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
      'import-x/extensions': ['.js', '.jsx', '.mjs', '.cjs'],
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
      '**/__snapshots__',
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
      'consistent-return': [
        'off',
        {
          treatUndefinedAsUnspecified: true,
        },
      ],
      'nonblock-statement-body-position': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/prefer-default-export': 'error',
      'import-x/default': 'off',
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
      'react/sort-prop-types': [
        'error',
        {
          ignoreCase: true,
          requiredFirst: true,
          sortShapeProp: true,
          callbacksLast: true,
        },
      ],
      'react/no-array-index-key': 'error',
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
          callbacksLast: true,
        },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-boolean-value': ['error', 'always'],
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-for-loop': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/better-regex': 'error',
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-query-selector': 'off',
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
      'unicorn/no-this-assignment': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-dom-node-dataset': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'promise/no-nesting': 'off',
      'promise/always-return': 'off',
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
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
        },
      ],
      'unicorn/prefer-event-target': 'off',
    },
  },
  ...[
    jsxA11y.flatConfigs.recommended,
    {
      languageOptions: {
        globals: {
          ...globals.browser,
        },
      },
      rules: {
        'import-x/no-unresolved': [
          'error',
          {
            ignore: ['^react', '^react-dom'],
          },
        ],
        'unicorn/prefer-string-replace-all': 'off',
        'unicorn/prefer-number-properties': 'off',
        'unicorn/prefer-modern-math-apis': 'off',
        'unicorn/prefer-dom-node-append': 'off',
        'unicorn/prefer-dom-node-remove': 'off',
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              camelCase: true,
              pascalCase: true,
            },
            ignore: ['en-US.ts', 'zh-CN.ts'],
          },
        ],
      },
    },
  ].map((it) => ({
    files: ['packages/*/src/**'],
    ignores: ['**/__doc__/**', '**/__test__/**'],
    ...it,
  })),
  // all test files
  {
    files: ['test/**', '**/__test__/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'global-require': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'react/display-name': 'off',
      'react/jsx-handler-names': 'off',
      'import-x/no-dynamic-require': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['**/__doc__/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // test case and doc case
  {
    files: ['**/__doc__/**/*.{ts,tsx}', '**/__test__/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      'react/display-name': 'off',
      'react/jsx-handler-names': 'off',
      'react/no-array-index-key': 'off',
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['^react', '^react-dom'],
        },
      ],
      'import-x/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
        },
      ],
    },
  },
  // all scripts
  {
    files: ['**/scripts/**', '*.{js,mjs}', '*.*.{js,mjs}', 'platforms/docs/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
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
  // docs src
  {
    files: ['platforms/docs/src/**/*.{ts,tsx}', 'platforms/docs/next-env.d.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'react/no-array-index-key': 'off',
      'react/display-name': 'off',
      'react/jsx-handler-names': 'off',
      'react/prop-types': 'off',
      'promise/catch-or-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'import-x/prefer-default-export': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: ['not-found.tsx', 'next-env.d.ts'],
        },
      ],
    },
  },
];
