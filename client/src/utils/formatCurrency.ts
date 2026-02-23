/**
 * Format a number as Nigerian Naira (₦).
 */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
