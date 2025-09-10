import { defineConfig, devices } from '@playwright/test';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    timeout: 30000,
    use: {
      baseURL: `http://localhost:${port}`,
      trace: 'on-first-retry',
    },
    webServer: [
      {
        command: `PORT=${port} npm run dev`,
        url: `http://localhost:${port}`,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
      },
    ],

    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
});
