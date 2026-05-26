import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage.js';

test.describe('Playwright 1.59 await using — async disposables', () => {
  test('auto-cleanup of page with await using', async ({ browser }) => {
    const context = await browser.newContext();

    await test.step('Step 1: Use page with await using and verify navigation', async () => {
      await using page = await context.newPage();
      const loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    await test.step('Step 2: Verify page was auto-closed by await using', async () => {
      expect(context.pages().length).toBe(0);
    });

    await context.close();
  });

  test('auto-cleanup of route with await using', async ({ page }) => {
    let intercepted = false;

    await test.step('Step 1: Route intercepts while in scope', async () => {
      await using route = await page.route('**/*', async r => {
        intercepted = true;
        await r.continue();
      });
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      expect(intercepted).toBe(true);
    });

    await test.step('Step 2: Route is removed after scope exit', async () => {
      intercepted = false;
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      expect(intercepted).toBe(false);
    });
  });

  test('auto-cleanup of addInitScript with await using', async ({ page }) => {
    await test.step('Step 1: Init script runs while in scope', async () => {
      await using script = await page.addInitScript(() => {
        (window as any).__initRan = true;
      });
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const ran = await page.evaluate(() => (window as any).__initRan);
      expect(ran).toBe(true);
    });

    await test.step('Step 2: Init script removed after scope exit', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const ran = await page.evaluate(() => (window as any).__initRan);
      expect(ran).toBeUndefined();
    });
  });
});
