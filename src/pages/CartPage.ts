import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async expectProduct(productName: string) {
    await expect(this.page).toHaveURL(/.*cart\.html/);
    await expect(this.page.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
