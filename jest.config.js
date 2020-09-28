module.exports = {
  verbose: true,
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/src/app/shared/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@environment/(.*)': '<rootDir>/src/environments/$1',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@environment/(.*)': '<rootDir>/src/environments/$1',
    '@providers/(.*)': '<rootDir>/src/app/providers/$1',
    // electron: '<rootDir>/__mocks__/electron.js'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.json$': '<rootDir>/jest-preprocessor.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/node_modules/', '/server/', '/electron/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/e2e'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.spec.json',
    },
  },
};
