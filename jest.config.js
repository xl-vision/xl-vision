// eslint-disable-next-line import/no-extraneous-dependencies
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  verbose: true,
  preset: 'ts-jest',
  // testEnvironment: 'node',
  setupFiles: ['./test/setup.js'],
  setupFilesAfterEnv: ['./test/setup.env.js'],
  testMatch: [
    '<rootDir>/test/__test__/*.{ts,tsx}',
    '<rootDir>/packages/*/src/**/__test__/*.{ts,tsx}',
  ],
  // collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.{ts,tsx}',
    '!<rootDir>/packages/icons/**',
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
