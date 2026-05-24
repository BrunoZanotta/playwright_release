import { checkoutCustomer } from '../../src/data/checkoutData.js';
import { test } from '../../src/fixtures/fixtures.js';

const products = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt'
] as const;

test.describe('SauceDemo multi-product checkout — Playwright 1.58 features', () => {
  test('completes a multi-product purchase with the standard user', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    await test.step('Step 1: Login with the standard user', async () => {
      await loginPage.goto();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
    });

    await test.step('Step 2: Add 3 products to cart', async () => {
      await inventoryPage.addMultipleProductsToCart([...products]);
      await inventoryPage.openCart();
    });

    await test.step('Step 3: Review the cart and start checkout', async () => {
      await cartPage.expectProducts([...products]);
      await cartPage.checkout();
    });

    await test.step('Step 4: Complete the checkout flow', async () => {
      await checkoutPage.fillCustomer(checkoutCustomer);
      await checkoutPage.expectValidTotal();
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderComplete();
    });

    await test.step('Step 5: Validate the confirmation visuals', async () => {
      await checkoutPage.expectConfirmationVisuals();
    });
  });
});
