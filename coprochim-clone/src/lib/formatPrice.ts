/**
 * Price formatting.
 *
 * The source site renders prices as "12,000 د.ج" in *both* locales — it uses
 * the `ar-DZ` currency symbol with comma thousands separators and Western
 * digits (the Store API reports `currency_suffix: "د.ج"` and
 * `currency_thousand_separator: ","`). Reproduced exactly.
 */
const CURRENCY_SUFFIX = 'د.ج'

/** Formats an integer dinar amount, e.g. `12000` -> `"12,000 د.ج"`. */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${CURRENCY_SUFFIX}`
}
