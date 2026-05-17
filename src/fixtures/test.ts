import { test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';

type Pages = {
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  inventoryPage: InventoryPage;
  loginPage: LoginPage;
};

export const test = base.extend<Pages>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});

export { expect } from '@playwright/test';
