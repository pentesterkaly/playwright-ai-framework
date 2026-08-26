/**
 * Healer regression test.
 *
 * Purpose:
 * Validates that the Healer can diagnose and safely correct
 * an intentionally invalid test assertion.
 *
 * This test provides a known-good baseline after the intentional
 * failure has been healed. It is not ordinary application coverage.
 */


import { test, expect } from '../../../framework/fixtures/base';
import { LoginPage } from '../pages/LoginPage';
import users from './data/users.json';

test.describe('Authentication @smoke @critical', () => {
  test('standard user login succeeds', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    const inventoryPage = await loginPage.loginAs(users.standard);

    await expect(inventoryPage.productsHeader).toHaveText('Products');
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(loginPage.usernameInput).not.toBeVisible();
    await expect(loginPage.passwordInput).not.toBeVisible();
    await expect(loginPage.loginButton).not.toBeVisible();
  });
});
