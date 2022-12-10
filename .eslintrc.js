const confusingBrowserGlobals = require('confusing-browser-globals');
const fs = require('fs-extra');
const path = require('path');

const resolveAlias = () => {
  const basePath = path.join(__dirname, 'packages');

  const files = fs.readdirSync(basePath);

  return files
    .map((it) => path.join(basePath, it))
    .map((it) => {
      const pkgPath = path.join(it, 'package.json');
      const srcPath = path.join(it, 'src');
      if (fs.pathExistsSync(pkgPath)) {
        return {
          name: fs.readJSONSync(pkgPath).name,
          path: srcPath,
        };
      }
      return undefined;
    })
    .filter(Boolean)
    .reduce((a, b) => ({ ...a, [b.name]: b.path }), {});
};

const alias = resolveAlias();

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        packages: ['packages/*'],
      },
    },
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    requireConfigFile: false,
    babelOptions: {
      plugins: [],
    },
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['unicorn'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        // packageDir: __dirname,
        devDependencies: ['scripts/**', './.*.js'],
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
        additionalHooks: '(useIsomorphicLayoutEffect)',
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
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
      },
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      plugins: ['@typescript-eslint'],
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
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: {
              memberTypes: ['signature', 'constructor', 'field', 'method'],
              optionalityOrder: 'optional-first',
              order: 'alphabetically-case-insensitive',
            },
          },
        ],
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              '{}': false,
            },
          },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
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
      },
    },
    {
      files: ['packages/**/__doc__/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
