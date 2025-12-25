/**
 * Money and number parsing utilities
 * Handles flexible decimal input (comma and dot) and proper currency formatting
 */

/**
 * Parse a number from user input, accepting both comma and dot as decimal separator
 * Returns null if input is invalid
 */
export function parseNumberFlexible(input: string): number | null {
  if (!input || typeof input !== "string") return null;
  
  // Trim whitespace
  const trimmed = input.trim();
  if (!trimmed) return null;
  
  // Replace comma with dot for parsing
  const normalized = trimmed.replace(",", ".");
  
  // Try to parse
  const parsed = parseFloat(normalized);
  
  // Validate result
  if (isNaN(parsed) || !isFinite(parsed)) return null;
  
  return parsed;
}

/**
 * Format a number as currency with proper suffix and decimal places
 * Always shows 2 decimal places for currency
 */
export function formatMoney(
  value: number,
  currency: "BGN" | "EUR",
  lang: "bg" | "en"
): string {
  const formatted = value.toFixed(2);
  
  if (currency === "BGN") {
    const suffix = lang === "bg" ? " лв" : " BGN";
    return formatted + suffix;
  } else {
    return formatted + " €";
  }
}

/**
 * Round to 2 decimal places to avoid floating point errors in display
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

