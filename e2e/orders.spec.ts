import { test, expect } from '@playwright/test';

test.describe('Order Details Page', () => {
  test('should handle non-existent order gracefully', async ({ page }) => {
    const response = await page.goto('/orders/non-existent-order-id');

    // Should return 404
    expect(response?.status()).toBe(404);
  });

  test('should have proper page structure for order page', async ({ page }) => {
    // This test would need a valid order ID from the API
    // For now, we just test that the route exists and handles errors
    await page.goto('/orders/test-order');

    // The page should at least have header and footer
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});
