import { checkoutCustomer } from '../../src/data/checkoutData.js';
import { test } from '../../src/fixtures/fixtures.js';

const products = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt'
] as const;

test.describe('SauceDemo multi-product checkout — Playwright 1.59 features', () => {
  test('completes a multi-product purchase with the standard user', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    await test.step('Step 1: Login with the standard user', async () => {
      await loginPage.showChapter('Login', {
        description: 'Authenticate with the standard user',
        duration: 1000
      });
      await loginPage.goto();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
    });

    await test.step('Step 2: Add 3 products to cart', async () => {
      await inventoryPage.showChapter('Add products', {
        description: 'Add 3 products to the shopping cart',
        duration: 1000
      });
      await inventoryPage.addMultipleProductsToCart([...products]);
      await inventoryPage.openCart();
    });

    await test.step('Step 3: Review the cart and start checkout', async () => {
      await cartPage.showChapter('Cart review', {
        description: 'Verify cart contents and proceed to checkout',
        duration: 1000
      });
      await cartPage.expectProducts([...products]);
      await cartPage.checkout();
    });

    await test.step('Step 4: Complete the checkout flow', async () => {
      await checkoutPage.showChapter('Checkout', {
        description: 'Fill customer details and validate totals',
        duration: 1000
      });
      await checkoutPage.fillCustomer(checkoutCustomer);
      await checkoutPage.expectValidTotal();
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderComplete();
    });

    await test.step('Step 5: Validate the confirmation visuals', async () => {
      await checkoutPage.showChapter('Order confirmed', {
        description: 'Verify order confirmation visuals',
        duration: 1000
      });
      await checkoutPage.expectConfirmationVisuals();
    });
  });
});
