const confusingBrowserGlobals = require('confusing-browser-globals');
const path = require('path');
const fs = require('fs-extra');

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
      version: '16.8',
    },
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        packages: ['packages/*'],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['airbnb', 'airbnb/hooks', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['unicorn'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        // packageDir: __dirname,
        devDependencies: ['scripts/**', './.*.js'],
      },
    ],
    'import/no-unresolved': ['error'],
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
    'react-hooks/exhaustive-deps': [
      'error',
      {
        // custom hooks
        additionalHooks: '(useLayoutEffect|useUpdated)',
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
    'react/forbid-prop-types': 'off', // todo remove
    'react/jsx-boolean-value': ['error', 'always'],
    'react/display-name': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
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
    'unicorn/prefer-query-selector': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
        // 'plugin:@typescript-eslint/recommended',
      ],
      rules: {
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
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
      },
    },
    {
      files: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
      rules: {
        // 'import/no-unresolved': [
        //   'error',
        //   {
        //     ignore: ['^react', '^react-dom'],
        //   },
        // ],
      },
    },
    {
      files: ['test/__test__/**', 'packages/*/src/**/__test__/**', 'packages/*/src/**/__doc__/**'],
      rules: {
        'react/display-name': 'off',
        'react/button-has-type': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-named-as-default': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'no-console': 'off',
      },
    },
  ],
};
