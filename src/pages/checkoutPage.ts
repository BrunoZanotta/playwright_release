import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

type Customer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly ponyExpressImage: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]').describe('First name input');
    this.lastNameInput = page.locator('[data-test="lastName"]').describe('Last name input');
    this.postalCodeInput = page.locator('[data-test="postalCode"]').describe('Postal code input');
    this.continueButton = page.getByRole('button', { name: 'Continue' }).describe('Continue to overview');
    this.finishButton = page.getByRole('button', { name: 'Finish' }).describe('Finish order');
    this.completeHeader = page.locator('[data-test="complete-header"]').describe('Order complete header');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]').describe('Pony express confirmation image');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]').describe('Checkout subtotal');
    this.taxLabel = page.locator('[data-test="tax-label"]').describe('Checkout tax');
    this.totalLabel = page.locator('[data-test="total-label"]').describe('Checkout total');
  }

  async fillCustomer(customer: Customer) {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click({ steps: 5 });
  }

  async finishOrder() {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await this.finishButton.click({ steps: 5 });
  }

  async expectOrderComplete() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectConfirmationVisuals() {
    await expect(this.ponyExpressImage).toBeVisible();
  }

  async expectValidTotal() {
    const itemTotal = parseFloat((await this.subtotalLabel.textContent())!.replace('Item total: $', ''));
    const tax = parseFloat((await this.taxLabel.textContent())!.replace('Tax: $', ''));
    const total = parseFloat((await this.totalLabel.textContent())!.replace('Total: $', ''));
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  }

  async showChapter(title: string, options?: { description?: string; duration?: number }) {
    await this.page.screencast.showChapter(title, options);
  }
}
