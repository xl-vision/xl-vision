module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:@next/next/recommended'],
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
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
    '@next/next/link-passhref': 'error',
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
