// eslint-disable-next-line import/no-extraneous-dependencies
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  verbose: true,
  preset: 'ts-jest',
  // testEnvironment: 'node',
  setupFiles: ['./test/setup.js'],
  testMatch: ['**/packages/*/src/**/__test__/*.{ts,tsx}'],
  // collectCoverage: true,
  collectCoverageFrom: [
    '**/packages/*/src/**/*.{ts,tsx}',
    '!**/packages/react/src/icon/*.tsx',
    '!**/__*__/**',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      diagnostics: true,
    },
  },
  testURL: 'http://localhost',
};
