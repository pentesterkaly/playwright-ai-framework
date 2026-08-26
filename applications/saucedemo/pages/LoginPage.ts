import { Locator, Page } from '@playwright/test';

import { BasePage } from '../../../framework/pages/BasePage';
import { InventoryPage } from './InventoryPage';

export type SauceUser = {
  username: string;
  password: string;
};

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
  }

 async goto(): Promise<void> {
  await this.page.goto('/');
  await this.waitForReady();
}

  async loginAs(user: SauceUser): Promise<InventoryPage> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }
}
