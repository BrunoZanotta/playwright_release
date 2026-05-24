import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly inventoryItem: Locator;
  readonly addToCartButton: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]').describe('Shopping cart link');
    this.inventoryItem = page.locator('[data-test="inventory-item"]').describe('Inventory product card');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' }).describe('Add to cart action');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]').describe('Product price label');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.title).toBeVisible();
  }

  async addMultipleProductsToCart(productNames: string[]) {
    for (const name of productNames) {
      const product = this.inventoryItem.filter({
        hasText: name
      });

      await expect(product).toBeVisible();
      await product.locator(this.addToCartButton).click({ steps: 5 });
    }

    await expect(this.cartLink).toHaveText(String(productNames.length));
  }

  async getProductPrice(productName: string): Promise<number> {
    const product = this.inventoryItem.filter({
      hasText: productName
    });
    const priceText = await product.locator(this.itemPrice).textContent();
    return parseFloat(priceText!.replace('$', ''));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
