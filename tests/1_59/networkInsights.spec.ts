import { test, expect } from '@playwright/test';
import { buildLoginUrl } from '../../src/helpers/loginEnv.js';
import { LoginPage } from '../../src/pages/loginPage.js';

test.describe('Playwright 1.59 network insights — httpVersion, existingResponse, isClosed', () => {
  test('captures response HTTP version from navigation', async ({ page }) => {
    await test.step('Step 1: Navigate and get response HTTP version', async () => {
      const response = await page.goto(buildLoginUrl('/'));
      const httpVersion = await response!.httpVersion();
      expect(httpVersion).toBeTruthy();
    });
  });

  test('gets existing response from a request without waiting', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Step 1: Navigate to generate a request', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2: Get existing response from last request', async () => {
      const requests = await page.requests();
      const lastRequest = requests[requests.length - 1];
      const existingResponse = lastRequest.existingResponse();
      expect(existingResponse).toBeTruthy();
    });
  });

  test('checks browserContext isClosed state', async ({ browser }) => {
    await test.step('Step 1: Create context and verify open/closed lifecycle', async () => {
      const context = await browser.newContext();
      expect(context.isClosed()).toBe(false);
      await context.close();
      expect(context.isClosed()).toBe(true);
    });
  });
});
