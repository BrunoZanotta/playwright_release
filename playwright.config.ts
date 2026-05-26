import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

process.loadEnvFile('.env');

const baseURL = process.env.BASE_URL;
const isCi = process.env.CI === '1' || process.env.CI === 'true';

if (!baseURL) {
  throw new Error('Missing required environment variable: BASE_URL');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      show: {
        actions: { position: 'top-right' },
        test: { position: 'top-left' }
      }
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
