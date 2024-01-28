const config = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'wip',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'merge',
      ],
    ],
    // 'type-case': [2, 'always', ['lower-case', 'upper-case']],
    'scope-case': [2, 'always', ['pascal-case', 'camel-case']],
  },
};

export default config;
