import { defineConfig, devices } from '@playwright/test';
import baseEnvUrl from '../BookStore/tests/utils/environmentBaseUrl';
require('dotenv').config({ path: '.env' });

export default defineConfig({
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],            
    ['html', { outputFolder: 'playwright-report', open: 'never' }]  //  HTML report 
  ],

  timeout: 40 * 1000,
  use: {
    viewport: { width: 1920, height: 1120 },
    trace: 'on',

    baseURL: process.env.ENV.trim() === 'prod'
      ? baseEnvUrl.prod.api
      : process.env.ENV.trim() === 'ci'
        ? baseEnvUrl.ci.api
        : baseEnvUrl.local.api,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 980 }
      },
    },
  ],

});

