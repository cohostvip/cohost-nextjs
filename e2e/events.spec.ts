import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test('should load the events listing page', async ({ page }) => {
    await page.goto('/events');

    // Check page title
    await expect(page).toHaveTitle(/Cohost/);
  });

  test('should display events grid or list', async ({ page }) => {
    await page.goto('/events');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // The page should have main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('Event Details Page', () => {
  test('should handle non-existent event gracefully', async ({ page }) => {
    const response = await page.goto('/events/non-existent-event-id');

    // Should return 404 or redirect
    expect(response?.status()).toBe(404);
  });
});
