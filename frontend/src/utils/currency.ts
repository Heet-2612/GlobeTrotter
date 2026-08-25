/**
 * Formats a monetary amount using local destination currency (or default INR).
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string = 'INR',
  currencySymbol?: string
): string {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const code = (currencyCode || 'INR').toUpperCase();

  try {
    // Map standard locale per currency
    const localeMap: Record<string, string> = {
      INR: 'en-IN',
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
      JPY: 'ja-JP',
    };

    const locale = localeMap[code] || 'en-IN';

    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
    }).format(numericAmount);

    return formatted;
  } catch (e) {
    const symbol = currencySymbol || (code === 'INR' ? '₹' : '$');
    return `${symbol}${numericAmount.toLocaleString()}`;
  }
}
