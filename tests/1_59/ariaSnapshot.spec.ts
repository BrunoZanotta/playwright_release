import { test } from '../../src/fixtures/fixtures.js';

test.describe('Playwright 1.59 aria snapshots — page.ariaSnapshot() and locator.ariaSnapshot()', () => {
  test('captures page-level aria snapshot of inventory', async ({
    inventoryPage,
    loginPage
  }) => {
    await test.step('Step 1: Login and navigate to inventory', async () => {
      await loginPage.goto();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
    });

    await test.step('Step 2: Capture page-level aria snapshot', async () => {
      await inventoryPage.expectAriaSnapshotContains('Products');
    });
  });

  test('captures locator aria snapshot with depth option', async ({ loginPage }) => {
    await test.step('Step 1: Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2: Capture shallow snapshot of login form', async () => {
      await loginPage.expectFormAriaSnapshotContains(2, ['Username', 'Password']);
    });
  });

  test('captures locator aria snapshot with mode option', async ({ loginPage }) => {
    await test.step('Step 1: Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2: Capture AI-mode snapshot of the page body', async () => {
      await loginPage.expectBodyAriaSnapshotMode('ai');
    });
  });
});
