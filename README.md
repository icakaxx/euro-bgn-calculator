# BGN→EUR Shop Calculator

A production-ready web application for Bulgarian shoppers during the EUR transition. Instantly convert prices from BGN (leva) to EUR, build shopping bills, handle weighted products, and calculate change when paying in EUR.

## Features

✅ **Instant BGN→EUR Conversion** - See EUR values in real-time as you type
✅ **Editable Exchange Rate** - Use the official 1.95583 rate or customize it
✅ **Bill Building** - Add items with unit pricing or weight-based pricing (kg/grams)
✅ **Change Calculator** - Enter payment in EUR and instantly see change or remaining amount
✅ **Session Persistence** - All data survives page refresh (stored in sessionStorage)
✅ **Undo Functionality** - Single-level undo when clearing entire bill
✅ **Bilingual Support** - Switch between Bulgarian and English
✅ **Dark/Light Theme** - Toggle between themes with persistence
✅ **Mobile Optimized** - Responsive design for supermarket use
✅ **Accessible** - Proper labels, keyboard navigation, focus states

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Theme**: next-themes
- **State**: React hooks + sessionStorage

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
euro-bgn-calculator/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Main calculator page with state management
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   └── tabs.tsx
│   ├── header-bar.tsx      # App header with rate control and toggles
│   ├── rate-control.tsx    # Exchange rate input with reset
│   ├── lang-toggle.tsx     # Language switcher (BG/EN)
│   ├── theme-toggle.tsx    # Dark/light mode toggle
│   ├── add-item-form.tsx   # Form to add unit/weight items
│   ├── bill-list.tsx       # List of all bill items
│   ├── bill-item-row.tsx   # Single item row with delete
│   ├── totals-panel.tsx    # Total amounts in BGN and EUR
│   ├── payment-panel.tsx   # Payment input and change calculation
│   └── undo-toast.tsx      # Undo notification after clearing bill
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── ids.ts              # ID generator for items
│   ├── money.ts            # Number parsing and currency formatting
│   ├── bill.ts             # Bill calculation logic
│   ├── i18n.ts             # Internationalization (BG/EN)
│   ├── storage.ts          # sessionStorage persistence
│   └── utils.ts            # Tailwind class merging utility
├── styles/
│   └── globals.css         # Global styles and theme variables
└── package.json
```

## How It Works

### Math & Rounding Strategy

- **Conversion Formula**: `EUR = BGN / rate`
- **Display**: All currency values are displayed with 2 decimal places
- **Internal Calculation**: Uses `Math.round(value * 100) / 100` to avoid floating-point errors
- **Weight Items**: Total kg = `kg + grams/1000`, then multiply by price per kg

### Session Storage Persistence

The app uses `sessionStorage` to persist state across page refreshes within the same browser tab:

1. **Auto-save**: State is saved to sessionStorage with 200ms debouncing on every change
2. **Storage Key**: Main state stored under `bgn_eur_calculator_state`
3. **Snapshot Key**: Undo snapshot stored under `bgn_eur_calculator_snapshot`
4. **Data Persisted**:
   - Exchange rate
   - All bill items (with details)
   - Payment amount
   - Selected language
5. **Theme**: Persisted via next-themes library (uses localStorage due to library requirements)

### Undo Snapshot

When the user clicks "Clear Bill":
1. Current state is saved to a snapshot in sessionStorage
2. Bill items and payment amount are cleared
3. Undo toast appears for 5 seconds
4. User can restore the last cleared bill once
5. After undo or timeout, snapshot is cleared

### Internationalization

Simple dictionary-based i18n:
- All UI text stored in `lib/i18n.ts` as `{ bg: {...}, en: {...} }`
- Language auto-detected from browser on first load
- Translation function: `t(key, lang)`
- Currency suffixes: "лв" (BG) / "BGN" (EN) for BGN, "€" for EUR

## Usage Guide

### Basic Workflow

1. **Set Exchange Rate** (optional) - Default is 1.95583, or customize it
2. **Add Items**:
   - **Unit Mode**: Enter name (optional), unit price in BGN, and quantity
   - **Weight Mode**: Enter name (optional), price per kg, kg, and grams
3. **Review Bill** - See line totals in BGN and EUR
4. **Enter Payment** - Type amount in EUR to see change or remaining amount
5. **Clear Bill** - Delete all items with undo option

### Keyboard-Friendly

- After adding an item, focus returns to the price field for fast repeated entry
- All inputs accept both `.` and `,` as decimal separators
- Tab navigation works throughout

### Mobile Use

- Responsive layout stacks on mobile
- Large touch targets for supermarket use
- Bottom sticky totals panel

## Test Scenarios (Manual)

### Test 1: Basic Conversion
1. Type `10` in unit price → Should show ~5.11 EUR
2. Change rate to `2.00` → Should show 5.00 EUR

### Test 2: Unit Item
1. Add item with price 3.50 BGN, qty 2
2. Should show line total: 7.00 BGN ≈ 3.58 EUR

### Test 3: Weight Item
1. Switch to Weight mode
2. Enter price per kg: 12.00 BGN
3. Enter 1 kg, 250 grams
4. Should show: 1.250 kg, total 15.00 BGN ≈ 7.67 EUR

### Test 4: Payment & Change
1. Add items totaling ~10 EUR
2. Enter paying: 20 EUR
3. Should show change: 10.00 EUR (exact value depends on items)

### Test 5: Persistence
1. Add several items
2. Refresh page
3. All items should still be there

### Test 6: Undo
1. Add items
2. Click "Clear Bill"
3. Bill should be empty, undo toast appears
4. Click "Undo"
5. Bill should be restored

### Test 7: Language Switch
1. Click language toggle (BG/EN)
2. All UI text should translate
3. Refresh page
4. Language should persist

### Test 8: Theme Toggle
1. Click theme toggle (sun/moon icon)
2. Theme should switch between light and dark
3. Refresh page
4. Theme should persist

## Why sessionStorage vs localStorage?

- **sessionStorage** is used for bill data because the session is meant to be temporary (one shopping trip)
- **localStorage** (via next-themes) is used for theme because users want theme preference to persist across all sessions
- Language could use either; we chose sessionStorage for consistency with bill data

## Explainability

### State Management
- Single `BillState` object holds entire app state
- Pure functions in `lib/bill.ts` for all calculations (testable, predictable)
- State updates trigger debounced save to sessionStorage

### Component Architecture
- Strict separation: UI components in `components/`, logic in `lib/`
- Client components only when needed (state, effects, event handlers)
- Props drilling is minimal; state lives in main page

### Type Safety
- Discriminated unions for `BillItem` (unit vs weight)
- All money amounts are `number` (not string) internally
- Flexible parsing on input, strict formatting on output

## Future Enhancements

If you want to make this even better for supermarket use:

- **PWA Support** - Add manifest and service worker for offline use
- **Barcode Scanner** - Integrate camera for scanning prices
- **Quick-Add Mode** - Price-only input with auto-generated names
- **Receipt Printing** - Generate printable receipt
- **Multiple Bills** - Save and load different shopping sessions
- **Analytics** - Track most-added items, average basket value

## License

This project is open-source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for Bulgarian shoppers navigating the EUR transition.

