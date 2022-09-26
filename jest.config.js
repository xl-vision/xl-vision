// eslint-disable-next-line import/no-extraneous-dependencies
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
const getBabelConfig = require('./scripts/getBabelConfig');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  // testEnvironment: 'node',
  setupFiles: ['./test/setup.js'],
  setupFilesAfterEnv: ['./test/setup.env.js'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/__test__/*.{ts,tsx}', '<rootDir>/packages/**/__test__/*.{ts,tsx}'],
  // collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.{ts,tsx}',
    '!<rootDir>/packages/icons/**',
    '!**/__*__/**',
  ],
  snapshotSerializers: [],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mocks/fileMock.js',
    '\\.(css|less)$': '<rootDir>/test/mocks/styleMock.js',
    'test/utils': '<rootDir>/test/utils/index.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        diagnostics: true,
        babelConfig: {
          ...getBabelConfig(),
        },
      },
    ],
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
};
