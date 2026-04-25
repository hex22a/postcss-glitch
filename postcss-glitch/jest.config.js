export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  verbose: true,

  testMatch: ['**/__tests__/**/*.ts?(x)'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
};
