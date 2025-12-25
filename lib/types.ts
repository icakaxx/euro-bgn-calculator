// Core data types for the BGN→EUR Calculator

export type CurrencyRate = {
  bgnPerEur: number;
};

export type UnitItem = {
  id: string;
  type: "unit";
  name?: string;
  unitPriceBgn: number;
  qty: number;
};

export type WeightItem = {
  id: string;
  type: "weight";
  name?: string;
  pricePerKgBgn: number;
  kg: number; // integer >= 0
  grams: number; // 0..999
};

export type BillItem = UnitItem | WeightItem;

export type BillState = {
  rate: CurrencyRate;
  items: BillItem[];
  payingEur: number; // user input in EUR
  lang: "bg" | "en";
};

