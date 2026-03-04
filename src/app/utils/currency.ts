// Centralized currency configuration for the entire application
export const APP_CURRENCY = "FCFA";
export const APP_CURRENCY_DISPLAY = "CFA";

/**
 * Format amount with currency
 */
export function formatCurrency(amount: number = 0, currency?: string): string {
  const safeAmount = amount ?? 0;
  const curr = currency || APP_CURRENCY;
  
  if (curr === "FCFA" || curr === "CFA") {
    return `CFA ${safeAmount.toLocaleString("fr-FR")}`;
  }
  
  const symbol = getCurrencySymbol(curr);
  return `${symbol}${safeAmount.toLocaleString("fr-FR")}`;
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency?: string): string {
  const curr = currency || APP_CURRENCY;
  
  switch (curr) {
    case "FCFA":
    case "CFA":
      return "CFA ";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "PHP":
      return "₱";
    case "CNY":
    case "JPY":
      return "¥";
    case "KRW":
      return "₩";
    default:
      return "CFA ";
  }
}

/**
 * Get the currency name for forms/selects
 */
export function getCurrencyName(currency?: string): string {
  const curr = currency || APP_CURRENCY;
  
  switch (curr) {
    case "FCFA":
    case "CFA":
      return "FCFA (CFA)";
    case "USD":
      return "USD ($)";
    case "EUR":
      return "EUR (€)";
    case "GBP":
      return "GBP (£)";
    case "PHP":
      return "PHP (₱)";
    case "CNY":
      return "CNY (¥)";
    case "JPY":
      return "JPY (¥)";
    case "KRW":
      return "KRW (₩)";
    default:
      return "FCFA (CFA)";
  }
}
