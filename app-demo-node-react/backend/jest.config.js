export default {
  testEnvironment: 'node',

  testMatch: [
    '**/tests/**/*.test.js'
  ],

  transform: {},

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],

  coverageDirectory: 'coverage'
};
