/**
 * Currency utility module supporting local destination currency display
 * and presentation-time display currency conversion.
 */

export interface CurrencyItem {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyItem[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

/**
 * Formats a monetary amount using the specified currency code.
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: string = 'INR',
  currencySymbol?: string
): string {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const code = (currencyCode || 'INR').toUpperCase();

  try {
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
      maximumFractionDigits: code === 'JPY' ? 0 : numericAmount % 1 === 0 ? 0 : 2,
    }).format(numericAmount);

    return formatted;
  } catch (e) {
    const symbolMap: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    const symbol = currencySymbol || symbolMap[code] || '₹';
    return `${symbol}${numericAmount.toLocaleString()}`;
  }
}

/**
 * Converts an amount from one currency to another using exchange rates relative to USD.
 */
export function convertCurrency(
  amount: number | null | undefined,
  fromCode: string = 'INR',
  toCode: string = 'INR',
  rates: Record<string, number> = {}
): number {
  if (typeof amount !== 'number' || isNaN(amount)) return 0;
  const from = (fromCode || 'INR').toUpperCase();
  const to = (toCode || 'INR').toUpperCase();

  if (from === to) return amount;

  const fallbackRates: Record<string, number> = {
    USD: 1.0,
    INR: 86.5,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 152.3,
  };

  const fromRate = rates[from] || fallbackRates[from] || 1.0;
  const toRate = rates[to] || fallbackRates[to] || 1.0;

  const usdAmount = amount / fromRate;
  const converted = usdAmount * toRate;

  if (to === 'JPY') {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/**
 * Formats an amount with both native local currency and converted display currency.
 * e.g., "₹2,500 (≈ $28.90)"
 */
export function formatDualCurrency(
  amount: number | null | undefined,
  localCurrency: string = 'INR',
  displayCurrency: string = 'INR',
  rates: Record<string, number> = {},
  customLocalSymbol?: string
): string {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const localFormatted = formatCurrency(numericAmount, localCurrency, customLocalSymbol);

  const localCode = (localCurrency || 'INR').toUpperCase();
  const displayCode = (displayCurrency || 'INR').toUpperCase();

  if (localCode === displayCode) {
    return localFormatted;
  }

  const convertedAmount = convertCurrency(numericAmount, localCode, displayCode, rates);
  const displayFormatted = formatCurrency(convertedAmount, displayCode);

  return `${localFormatted} (≈ ${displayFormatted})`;
}
