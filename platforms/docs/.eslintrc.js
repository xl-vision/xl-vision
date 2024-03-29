module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:@next/next/recommended'],
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
  rules: {
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
    '@typescript-eslint/require-await': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  overrides: [
    {
      files: ['./src/pages/**'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
