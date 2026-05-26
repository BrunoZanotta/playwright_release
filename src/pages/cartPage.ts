import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' }).describe('Checkout button');
    this.itemName = page.locator('[data-test="inventory-item-name"]').describe('Cart item name');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]').describe('Cart item price');
  }

  async expectProducts(productNames: string[]) {
    await expect(this.page).toHaveURL(/.*cart\.html/);
    for (const name of productNames) {
      await expect(this.itemName.filter({ hasText: name })).toBeVisible();
    }
  }

  async getAllCartItemPrices(): Promise<number[]> {
    const count = await this.itemPrice.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.itemPrice.nth(i).textContent();
      prices.push(parseFloat(text!.replace('$', '')));
    }
    return prices;
  }

  async calculateCartTotal(): Promise<number> {
    const prices = await this.getAllCartItemPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  async checkout() {
    await this.checkoutButton.click({ steps: 5 });
  }

  async showChapter(title: string, options?: { description?: string; duration?: number }) {
    await this.page.screencast.showChapter(title, options);
  }
}
