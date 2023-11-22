import commitlintFormatter from './scripts/commitlintFormatter';

const config = {
  extends: ['@commitlint/config-conventional'],
  formatter: commitlintFormatter,
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
