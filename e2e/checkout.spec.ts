import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {


    test('run the full flow', async ({ page }) => {
        // Capture console logs
        page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
        await page.goto('/events/test-event');

        // Wait for content to load
        await page.waitForLoadState('networkidle');

        // The page should have main content area
        const main = page.locator('main');
        await expect(main).toBeVisible();
        await page.goto('http://localhost:3000/events/test-event');
        await page.getByRole('button', { name: 'Increase quantity' }).nth(2).click();
        await page.getByRole('button', { name: 'Increase quantity' }).nth(2).click();


        await expect(page.getByTestId('quantity-value').nth(2)).toHaveText('2');
        await page.getByTestId('get-tickets-button').first().click();

        // Confirm Pay Now button is disabled before customer info is added
        await expect(page.getByTestId('payment-submit')).toBeDisabled();

        await page.getByTestId('customer-first-name').fill('Jane');
        await page.getByTestId('customer-last-name').fill('Smith');
        await page.getByTestId('customer-email').fill('dev+e2e@segesv.com');
        await page.getByTestId('customer-phone').fill('2125551234');

        // Trigger blur to validate form
        await page.getByTestId('customer-phone').blur();

        // Confirm Pay Now button is enabled after customer info is added
        
        const stripeFrame = page.getByTestId('payment-card-container').locator('iframe').first().contentFrame();
        // Wait for Stripe iframe to be ready and fill card details
        const cardNumber = stripeFrame.getByPlaceholder('Card number');
        await cardNumber.waitFor({ state: 'visible' });
        await cardNumber.fill('4242424242424242');
        await stripeFrame.getByPlaceholder('MM / YY').fill('12/30');
        await stripeFrame.getByPlaceholder('CVC').fill('123');
        await expect(page.getByTestId('payment-submit')).toBeEnabled();

        await page.getByTestId('payment-submit').click();

        // Wait for order confirmation screen
        await expect(page.getByTestId('order-confirmation')).toBeVisible({ timeout: 30000 });
        await expect(page.getByText('Order Confirmed!')).toBeVisible();
        await expect(page.getByTestId('order-confirmation-id')).toBeVisible();

        // Click View Order button
        await page.getByTestId('view-order-button').click();

        // Wait for navigation to complete and log current URL
        await page.waitForLoadState('networkidle');
        console.log('Current URL:', page.url());

        // Verify order details page loads correctly (increase timeout for API call)
        await expect(page.getByTestId('order-details')).toBeVisible({ timeout: 15000 });
    });
});
