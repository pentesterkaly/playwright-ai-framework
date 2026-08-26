import { test, expect } from '../../../framework/fixtures/base';

import { LoginPage } from '../pages/LoginPage';

test.describe('Seed — environment baseline @smoke', () => {
  test('login page loads', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});