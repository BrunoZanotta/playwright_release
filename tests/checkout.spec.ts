import { checkoutCustomer, users } from '../src/data/users.js';
import { expect, test } from '../src/fixtures/test.js';

test.describe('SauceDemo checkout', () => {
  test('completes a purchase with the standard user', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    const productName = 'Sauce Labs Backpack';

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.expectLoaded();
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.openCart();

    await cartPage.expectProduct(productName);
    await cartPage.checkout();

    await checkoutPage.fillCustomer(checkoutCustomer);
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();

    await expect(checkoutPage.page.locator('[data-test="pony-express"]')).toBeVisible();
  });
});
