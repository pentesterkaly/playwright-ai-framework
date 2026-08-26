import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../framework/pages/BasePage';

export class InventoryPage extends BasePage {
  readonly productsHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.productsHeader = this.page.getByText('Products');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.waitForReady();
  }
}
