import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { buildLoginUrl, loginPassword, loginUsername } from '../helpers/loginEnv.js';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly cartLink: Locator;
  readonly loginForm: Locator;
  readonly pageBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.loginForm = page.locator('form');
    this.pageBody = page.locator('body');
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

  async expectFormAriaSnapshotContains(depth: number, expected: string[]) {
    const snapshot = await this.loginForm.ariaSnapshot({ depth });
    for (const text of expected) {
      expect(snapshot).toContain(text);
    }
  }

  async expectBodyAriaSnapshotMode(mode: 'ai' | 'default') {
    const snapshot = await this.pageBody.ariaSnapshot({ mode });
    expect(snapshot.length).toBeGreaterThan(0);
  }

  async showChapter(title: string, options?: { description?: string; duration?: number }) {
    await this.page.screencast.showChapter(title, options);
  }

  async emitConsoleMessages() {
    await this.page.evaluate(() => {
      console.log('info-message');
      console.warn('warn-message');
      console.error('error-message');
    });
  }

  async expectConsoleMessagesCount(min: number) {
    const messages = await this.page.consoleMessages();
    expect(messages.length).toBeGreaterThanOrEqual(min);
  }

  async expectConsoleMessagesFiltered(expected: string[]) {
    const messages = await this.page.consoleMessages({ filter: 'since-navigation' });
    const texts = messages.map(m => m.text());
    for (const msg of expected) {
      expect(texts).toContain(msg);
    }
  }

  async expectLastConsoleMessageTimestamp() {
    const messages = await this.page.consoleMessages();
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.timestamp()).toBeGreaterThan(0);
  }

  async clearAndExpectConsoleCleared() {
    await this.page.clearConsoleMessages();
    const messages = await this.page.consoleMessages();
    expect(messages.length).toBe(0);
  }

  async triggerPageError() {
    await this.page.evaluate(() => {
      setTimeout(() => {
        throw new Error('test-page-error');
      }, 0);
    });
    await this.page.waitForTimeout(500);
  }

  async expectPageErrors(min: number) {
    const errors = await this.page.pageErrors();
    expect(errors.length).toBeGreaterThanOrEqual(min);
  }

  async clearAndExpectPageErrorsCleared() {
    await this.page.clearPageErrors();
    const errors = await this.page.pageErrors();
    expect(errors.length).toBe(0);
  }
}
