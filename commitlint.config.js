module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: require.resolve('./scripts/commitlintFormatter'),
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
      ],
    ],
    // 'type-case': [2, 'always', ['lower-case', 'upper-case']],
    'scope-case': [2, 'always', ['pascal-case', 'camel-case']],
  },
};
