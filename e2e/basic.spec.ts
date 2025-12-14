
import { test, expect } from '@playwright/test';

test('App loads successfully and shows dashboard', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/AstroLeads/);

    // Check if sidebar is present
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check if main content area loads
    const upgradeText = page.locator('text=Limite d\'utilisation');
    await expect(upgradeText).toBeVisible();
});
