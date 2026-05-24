import { checkoutCustomer } from '../../src/data/checkoutData.js';
import { test } from '../../src/fixtures/fixtures.js';

test.describe('SauceDemo single product checkout', () => {
  test('completes a single product purchase with the standard user', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    const productName = 'Sauce Labs Backpack';

    await test.step('Step 1: Login with the standard user', async () => {
      await loginPage.goto();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
    });

    await test.step('Step 2: Add the product to cart', async () => {
      await inventoryPage.addMultipleProductsToCart([productName]);
      await inventoryPage.openCart();
    });

    await test.step('Step 3: Review the cart and start checkout', async () => {
      await cartPage.expectProducts([productName]);
      await cartPage.checkout();
    });

    await test.step('Step 4: Complete the checkout flow', async () => {
      await checkoutPage.fillCustomer(checkoutCustomer);
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderComplete();
    });

    await test.step('Step 5: Validate the confirmation visuals', async () => {
      await checkoutPage.expectConfirmationVisuals();
    });
  });
});
