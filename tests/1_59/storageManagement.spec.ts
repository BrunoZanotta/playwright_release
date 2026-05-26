import type { BrowserContext } from '@playwright/test';
import { test } from '@playwright/test';
import { CartPage } from '../../src/pages/cartPage.js';
import { CheckoutPage } from '../../src/pages/checkoutPage.js';
import { InventoryPage } from '../../src/pages/inventoryPage.js';
import { LoginPage } from '../../src/pages/loginPage.js';
import { checkoutCustomer } from '../../src/data/checkoutData.js';

const products = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light'
] as const;

test.describe('SauceDemo storage management — Playwright 1.59 setStorageState API', () => {
  test('persists cart state across contexts using setStorageState', async ({ browser }) => {
    let savedState: Awaited<ReturnType<BrowserContext['storageState']>>;

    await test.step('Step 1: Login and add products to cart', async () => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
      await inventoryPage.addMultipleProductsToCart([...products]);

      savedState = await context.storageState({ indexedDB: true });
      await context.close();
    });

    await test.step('Step 2: Create new context and restore state with setStorageState', async () => {
      const newContext = await browser.newContext();
      await newContext.setStorageState(savedState!);
      const page = await newContext.newPage();
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.goto();
      await inventoryPage.expectCartBadgeCount(products.length);

      await newContext.close();
    });

    await test.step('Step 3: Restore state and complete checkout', async () => {
      const checkoutContext = await browser.newContext();
      await checkoutContext.setStorageState(savedState!);
      const page = await checkoutContext.newPage();
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      await inventoryPage.goto();
      await inventoryPage.openCart();

      await cartPage.expectProducts([...products]);
      await cartPage.checkout();

      await checkoutPage.fillCustomer(checkoutCustomer);
      await checkoutPage.expectValidTotal();
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderComplete();

      await checkoutContext.close();
    });
  });
});
