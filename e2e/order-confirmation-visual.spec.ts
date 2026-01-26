import { test, expect } from '@playwright/test';

test.describe('Order Confirmation Page - Visual', () => {
  test('should display order confirmation with mock data', async ({ page }) => {
    // Use the test page that renders OrderDetails with mock data
    await page.goto('/test-order');
    await page.waitForLoadState('networkidle');

    // Verify order page loaded with real content
    await expect(page.locator('h1')).toContainText('Order #29231296375');

    // Verify status badge shows "Confirmed"
    await expect(page.locator('text=Confirmed')).toBeVisible();

    // Verify event info
    await expect(page.locator('text=Bklyn NYE 26 El Nico Rooftop Williamsburg')).toBeVisible();

    // Verify venue (use exact match to avoid matching the title)
    await expect(page.getByText('El Nico Rooftop', { exact: true })).toBeVisible();

    // Verify ticket item with group ID
    await expect(page.locator('text=Seated VIP')).toBeVisible();
    await expect(page.locator('text=EHOBBS3676')).toBeVisible();

    // Verify order summary shows total
    await expect(page.locator('text=$222.73')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/order-confirmation.png', fullPage: true });
  });

  test('should expand customer information', async ({ page }) => {
    await page.goto('/test-order');
    await page.waitForLoadState('networkidle');

    // Customer info should be collapsed by default
    const customerButton = page.locator('button:has-text("Customer Information")');
    await expect(customerButton).toBeVisible();

    // Click to expand
    await customerButton.click();

    // Customer details should now be visible
    await expect(page.locator('text=Estelle Hobbs')).toBeVisible();
    await expect(page.locator('text=ehob1358@icloud.com')).toBeVisible();

    // Take screenshot with expanded customer info
    await page.screenshot({ path: 'test-results/order-customer-expanded.png', fullPage: true });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/test-order');
    await page.waitForLoadState('networkidle');

    // Page should still show all content
    await expect(page.locator('h1')).toContainText('Order #');
    await expect(page.locator('text=Seated VIP')).toBeVisible();
    await expect(page.locator('text=$222.73')).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/order-mobile.png', fullPage: true });
  });

  test('interactive: pause to view order page', async ({ page }) => {
    await page.goto('/test-order');
    await page.waitForLoadState('networkidle');

    // Expand customer info
    await page.locator('button:has-text("Customer Information")').click();

    // Uncomment the line below to pause and interact with the page manually
    await page.pause();
  });
});
