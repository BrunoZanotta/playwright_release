import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { buildLoginUrl, loginPassword, loginUsername } from '../helpers/loginEnv.js';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async goto() {
    await this.page.goto(buildLoginUrl('/'));
    await expect(this.page).toHaveURL(buildLoginUrl('/'));
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async loginAsUser() {
    await this.usernameInput.fill(loginUsername);
    await this.passwordInput.fill(loginPassword);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(buildLoginUrl('/inventory.html'));
    await expect(this.cartLink).toBeVisible();
  }
}
