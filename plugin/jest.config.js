export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  setupFiles: ['<rootDir>/setup.jest.ts'],

  verbose: true,

  testMatch: ['**/__tests__/**/*.ts?(x)'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
        isolatedModules: true
      }
    ]
  }
};
