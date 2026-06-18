'use strict';

const { defineConfig } = require('@playwright/test');

const E2E_PORT = process.env.E2E_PORT || '4010';

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'tests/test-results/playwright-report' }]],
  outputDir: 'tests/test-results/playwright-output',
  use: {
    baseURL: `http://127.0.0.1:${E2E_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'fa-IR',
  },
  webServer: {
    command: `node tests/e2e/start-server.js`,
    url: `http://127.0.0.1:${E2E_PORT}/api/browse`,
    reuseExistingServer: false,
    timeout: 30000,
    env: {
      E2E_PORT,
    },
  },
});
