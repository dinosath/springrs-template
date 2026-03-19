import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './global-setup.ts',
  updateSnapshots: 'missing',
  snapshotDir: './e2e/screenshots',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'VITE_MOCK=true pnpm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        env: {
          VITE_MOCK: 'true',
        },
      },
});
