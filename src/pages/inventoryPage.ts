import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { buildLoginUrl } from '../helpers/loginEnv.js';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly inventoryItem: Locator;
  readonly addToCartButton: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]').describe('Shopping cart link');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]').describe('Cart item count badge');
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

  async expectAriaSnapshotContains(expected: string) {
    const snapshot = await this.page.ariaSnapshot();
    expect(snapshot).toContain(expected);
  }

  async goto() {
    await this.page.goto(buildLoginUrl('/inventory.html'));
    await this.expectLoaded();
  }

  async expectCartBadgeCount(expected: number) {
    await expect(this.cartBadge).toHaveText(String(expected));
  }

  async showChapter(title: string, options?: { description?: string; duration?: number }) {
    await this.page.screencast.showChapter(title, options);
  }
}
