import { test, expect } from '../../../../framework/fixtures/base';
import { LoginPage } from '../../pages/LoginPage';
import users from '../data/users.json';

test.describe('Authentication', () => {
  test('standard user login succeeds @smoke @critical', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.loginAs(users.standard);
    await expect(inventoryPage.productsHeader).toBeVisible();
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(loginPage.usernameInput).not.toBeVisible();
    await expect(loginPage.passwordInput).not.toBeVisible();
    await expect(loginPage.loginButton).not.toBeVisible();
  });
});
