/**
 * Simple client-side internationalization
 * Supports Bulgarian (bg) and English (en)
 */

export type Lang = "bg" | "en";

type TranslationKey =
  | "appTitle"
  | "exchangeRate"
  | "officialRate"
  | "resetRate"
  | "addItem"
  | "unit"
  | "weight"
  | "itemName"
  | "optional"
  | "unitPrice"
  | "pricePerKg"
  | "quantity"
  | "kg"
  | "grams"
  | "add"
  | "lineTotal"
  | "total"
  | "paying"
  | "change"
  | "remaining"
  | "clearBill"
  | "undo"
  | "billCleared"
  | "item"
  | "noItems"
  | "addFirstItem"
  | "language"
  | "theme"
  | "light"
  | "dark"
  | "bgn"
  | "eur"
  | "required"
  | "invalidNumber"
  | "gramsMustBe"
  | "priceMustBePositive"
  | "weightMustBePositive"
  | "viewBasket"
  | "basketSummary"
  | "close"
  | "itemsInBasket"
  | "inputCurrency"
  | "enterIn";

type Translations = Record<TranslationKey, string>;

const translations: Record<Lang, Translations> = {
  bg: {
    appTitle: "EuroBG Elka",
    exchangeRate: "Обменен курс",
    officialRate: "Официален фиксиран курс е 1.95583",
    resetRate: "Възстанови официален курс",
    addItem: "Добави артикул",
    unit: "Брой",
    weight: "Тегло",
    itemName: "Име на артикул",
    optional: "незадължително",
    unitPrice: "Единична цена",
    pricePerKg: "Цена за кг",
    quantity: "Количество",
    kg: "кг",
    grams: "грама",
    add: "Добави",
    lineTotal: "Общо",
    total: "Общо",
    paying: "Плащане",
    change: "Ресто",
    remaining: "Остава",
    clearBill: "Изчисти сметката",
    undo: "Върни",
    billCleared: "Сметката е изчистена",
    item: "Артикул",
    noItems: "Няма артикули",
    addFirstItem: "Добавете първия артикул, за да започнете",
    language: "Език",
    theme: "Тема",
    light: "Светла",
    dark: "Тъмна",
    bgn: "лв",
    eur: "€",
    required: "задължително",
    invalidNumber: "невалидно число",
    gramsMustBe: "грамите трябва да са между 0 и 999",
    priceMustBePositive: "цената трябва да е положителна",
    weightMustBePositive: "теглото трябва да е положително",
    viewBasket: "Преглед на кошницата",
    basketSummary: "Обобщение на кошницата",
    close: "Затвори",
    itemsInBasket: "артикула в кошницата",
    inputCurrency: "Въвеждане в",
    enterIn: "Въведи в",
  },
  en: {
    appTitle: "EuroBG Elka",
    exchangeRate: "Exchange Rate",
    officialRate: "Official fixed rate is 1.95583",
    resetRate: "Reset to official rate",
    addItem: "Add Item",
    unit: "Unit",
    weight: "Weight",
    itemName: "Item Name",
    optional: "optional",
    unitPrice: "Unit Price",
    pricePerKg: "Price per kg",
    quantity: "Quantity",
    kg: "kg",
    grams: "grams",
    add: "Add",
    lineTotal: "Total",
    total: "Total",
    paying: "Paying",
    change: "Change",
    remaining: "Remaining",
    clearBill: "Clear Bill",
    undo: "Undo",
    billCleared: "Bill cleared",
    item: "Item",
    noItems: "No items",
    addFirstItem: "Add your first item to get started",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    bgn: "BGN",
    eur: "€",
    required: "required",
    invalidNumber: "invalid number",
    gramsMustBe: "grams must be between 0 and 999",
    priceMustBePositive: "price must be positive",
    weightMustBePositive: "weight must be positive",
    viewBasket: "View Basket",
    basketSummary: "Basket Summary",
    close: "Close",
    itemsInBasket: "items in basket",
    inputCurrency: "Enter in",
    enterIn: "Enter in",
  },
};

/**
 * Get translation for a key in the specified language
 */
export function t(key: TranslationKey, lang: Lang): string {
  return translations[lang][key] || key;
}

/**
 * Detect browser language preference
 * Always defaults to Bulgarian (bg) as this app is primarily for Bulgarian users
 */
export function detectLanguage(): Lang {
  // Default to Bulgarian for all users
  return "bg";
}

