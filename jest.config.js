const nextJest = require('next/jest');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: '' });

// Any custom config you want to pass to Jest
const customJestConfig = {
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./setupTests.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/jest/__mocks__/styleMock.js',
    '^react(.*)$': '<rootDir>/node_modules/react$1',
  },
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '.'],
  collectCoverageFrom: [
    'astro_2.0/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'context/**/*.{ts,tsx}',
    'errors/**/*.{ts,tsx}',
    'features/**/*.{ts,tsx}',
    'helpers/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/index.ts',
    '!**/types/*.ts',
    '!**/tests/*.{ts,tsx}',
  ],
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig);
