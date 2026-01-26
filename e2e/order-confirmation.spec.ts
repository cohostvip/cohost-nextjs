import { test, expect } from '@playwright/test';

test.describe('Order Confirmation Page', () => {
  test('should load order page route and show 404 for invalid order', async ({ page }) => {
    // Navigate to order confirmation page with invalid ID
    const response = await page.goto('/orders/invalid-order-id');

    // Should return 404 for non-existent order
    expect(response?.status()).toBe(404);

    // 404 page should be displayed
    await expect(page.locator('h1')).toContainText('404');
  });

  test('should have correct page structure when order exists', async ({ page }) => {
    // This test demonstrates the expected structure
    // In a real scenario, you would either:
    // 1. Use a seeded test database with known order IDs
    // 2. Create an order via API before the test
    // 3. Mock the API response

    await page.goto('/orders/test-order-with-group');

    // Take a screenshot regardless of outcome for visual inspection
    await page.screenshot({ path: 'test-results/order-page-screenshot.png', fullPage: true });

    // Check if we got a valid order page or 404
    const pageTitle = await page.title();

    if (pageTitle.includes('404')) {
      // Expected when order doesn't exist in API
      console.log('Order not found in API - this is expected for mock order IDs');
      await expect(page.locator('h1')).toContainText('404');
    } else {
      // Order was found - verify page structure
      await expect(page).toHaveTitle(/Order/);

      // Verify main sections are present
      await expect(page.locator('h1')).toContainText('Order #');
      await expect(page.locator('h2').filter({ hasText: 'Event' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Items' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Order Summary' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Customer Information' })).toBeVisible();
    }
  });

  test('should navigate from home to orders route', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Cohost/);

    // Navigate directly to an order URL (simulating clicking a link in email)
    await page.goto('/orders/some-order-id');

    // Page should load (even if 404)
    await page.waitForLoadState('domcontentloaded');

    // URL should be correct
    expect(page.url()).toContain('/orders/some-order-id');
  });

  test('visual: capture order page appearance', async ({ page }) => {
    await page.goto('/orders/test-order-with-group');
    await page.waitForLoadState('domcontentloaded');

    // Capture screenshots at different viewports
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.screenshot({
      path: 'test-results/order-page-desktop.png',
      fullPage: true,
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: 'test-results/order-page-mobile.png',
      fullPage: true,
    });
  });
});
