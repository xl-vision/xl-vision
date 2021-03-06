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
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mocks/fileMock.js',
    '\\.(css|less)$': '<rootDir>/test/mocks/styleMock.js',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      diagnostics: true,
    },
  },
  testURL: 'http://localhost',
};
