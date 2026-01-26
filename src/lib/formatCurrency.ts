/**
 * Parse and format currency from the "USD,1000" format.
 * The amount is in cents (e.g., "USD,1000" = $10.00).
 *
 * @param amount - String in format "CURRENCY,CENTS" (e.g., "USD,1000")
 * @returns Formatted currency string (e.g., "$10.00")
 */
export function formatCurrency(amount: string): string {
  if (!amount) return '$0.00';

  const [currency, centsStr] = amount.split(',');
  const cents = parseInt(centsStr, 10);

  if (isNaN(cents)) return '$0.00';

  const dollars = cents / 100;

  // Use Intl.NumberFormat for proper currency formatting
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(dollars);
}

/**
 * Check if an amount is zero or empty.
 *
 * @param amount - String in format "CURRENCY,CENTS"
 * @returns true if amount is zero or invalid
 */
export function isZeroAmount(amount: string): boolean {
  if (!amount) return true;

  const [, centsStr] = amount.split(',');
  const cents = parseInt(centsStr, 10);

  return isNaN(cents) || cents === 0;
}
