module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
        ignore: [/^routes\.([A-Za-z]|-)+\.tsx?$/, 'next-env.d.ts'],
      },
    ],
    '@typescript-eslint/require-await': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
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
