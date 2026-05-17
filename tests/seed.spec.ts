import { users } from '../src/data/users.js';
import { expect, test } from '../src/fixtures/test.js';

test.describe('SauceDemo seed flows', () => {
  test('logs in and reaches the inventory page', async ({ inventoryPage, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.page.locator('[data-test="inventory-list"]')).toBeVisible();
  });
});
