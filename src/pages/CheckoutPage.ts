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

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillCustomer(customer: Customer) {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finishOrder() {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
