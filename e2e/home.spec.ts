import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // Check that the page has loaded
    await expect(page).toHaveTitle(/Cohost/);
  });

  test('should have header navigation', async ({ page }) => {
    await page.goto('/');

    // Check for header element
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should have footer', async ({ page }) => {
    await page.goto('/');

    // Check for footer element
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
