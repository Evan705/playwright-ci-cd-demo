import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  expect: {
    timeout: 5 * 1000,
  },

  reporter: 'html',

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});