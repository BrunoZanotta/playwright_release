import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.title).toBeVisible();
  }

  async addProductToCart(productName: string) {
    const product = this.page.locator('[data-test="inventory-item"]').filter({
      hasText: productName
    });

    await expect(product).toBeVisible();
    await product.getByRole('button', { name: 'Add to cart' }).click();
    await expect(this.cartLink).toHaveText('1');
  }

  async openCart() {
    await this.cartLink.click();
  }
}
