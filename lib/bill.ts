/**
 * Bill calculation logic
 * Pure functions for computing totals, conversions, and change
 */

import { BillItem, CurrencyRate, UnitItem, WeightItem } from "./types";
import { round2 } from "./money";

/**
 * Calculate line totals for a single item
 * Returns BGN and EUR amounts, plus optional metadata string for display
 */
export function calcItemTotals(
  item: BillItem,
  rate: CurrencyRate
): { lineBgn: number; lineEur: number; meta?: string } {
  let lineBgn = 0;
  let meta = "";

  if (item.type === "unit") {
    lineBgn = item.unitPriceBgn * item.qty;
  } else if (item.type === "weight") {
    const totalKg = item.kg + item.grams / 1000;
    lineBgn = item.pricePerKgBgn * totalKg;
    meta = `${totalKg.toFixed(3)} kg`;
  }

  const lineEur = lineBgn / rate.bgnPerEur;

  return {
    lineBgn: round2(lineBgn),
    lineEur: round2(lineEur),
    meta,
  };
}

/**
 * Calculate bill totals across all items
 */
export function calcBillTotals(
  items: BillItem[],
  rate: CurrencyRate
): { totalBgn: number; totalEur: number } {
  let totalBgn = 0;
  let totalEur = 0;

  for (const item of items) {
    const { lineBgn, lineEur } = calcItemTotals(item, rate);
    totalBgn += lineBgn;
    totalEur += lineEur;
  }

  return {
    totalBgn: round2(totalBgn),
    totalEur: round2(totalEur),
  };
}

/**
 * Calculate change when paying in EUR
 * Returns change (if positive) or remaining (if negative)
 */
export function calcChange(
  payingEur: number,
  totalEur: number
): { changeEur: number; remainingEur: number } {
  const diff = payingEur - totalEur;
  
  if (diff >= 0) {
    return {
      changeEur: round2(diff),
      remainingEur: 0,
    };
  } else {
    return {
      changeEur: 0,
      remainingEur: round2(Math.abs(diff)),
    };
  }
}

