"use client";

import * as React from "react";
import { Trash2, ShoppingBasket } from "lucide-react";
import { HeaderBar } from "@/components/header-bar";
import { AddItemForm } from "@/components/add-item-form";
import { BillList } from "@/components/bill-list";
import { TotalsPanel } from "@/components/totals-panel";
import { PaymentPanel } from "@/components/payment-panel";
import { UndoToast } from "@/components/undo-toast";
import { BasketSummaryModal } from "@/components/basket-summary-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillState, BillItem, UnitItem, WeightItem } from "@/lib/types";
import { calcBillTotals } from "@/lib/bill";
import { detectLanguage, type Lang } from "@/lib/i18n";
import {
  loadBillState,
  saveBillState,
  saveLastSnapshot,
  loadLastSnapshot,
  clearLastSnapshot,
} from "@/lib/storage";
import { t } from "@/lib/i18n";

const OFFICIAL_RATE = 1.95583;

export default function HomePage() {
  // Initialize state from storage or defaults
  const [state, setState] = React.useState<BillState>(() => {
    // Always use 'bg' as default during initial render to avoid hydration mismatch
    if (typeof window === "undefined") {
      return {
        rate: { bgnPerEur: OFFICIAL_RATE },
        items: [],
        payingEur: 0,
        lang: "bg",
      };
    }

    const loaded = loadBillState();
    if (loaded) {
      return loaded;
    }

    return {
      rate: { bgnPerEur: OFFICIAL_RATE },
      items: [],
      payingEur: 0,
      lang: detectLanguage(),
    };
  });

  // Undo state
  const [showUndo, setShowUndo] = React.useState(false);
  const undoTimeoutRef = React.useRef<NodeJS.Timeout>();

  // Basket summary modal state
  const [showBasketModal, setShowBasketModal] = React.useState(false);

  // Debounced save to sessionStorage
  const saveTimeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 200ms
    saveTimeoutRef.current = setTimeout(() => {
      saveBillState(state);
    }, 200);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state]);

  // Calculate totals
  const { totalBgn, totalEur } = calcBillTotals(state.items, state.rate);

  // Handlers
  const handleRateChange = (newRate: number) => {
    setState((prev) => ({
      ...prev,
      rate: { bgnPerEur: newRate },
    }));
  };

  const handleLangChange = (newLang: Lang) => {
    setState((prev) => ({
      ...prev,
      lang: newLang,
    }));
  };

  const handleAddItem = (item: UnitItem | WeightItem) => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  };

  const handleDeleteItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handlePayingChange = (amount: number) => {
    setState((prev) => ({
      ...prev,
      payingEur: amount,
    }));
  };

  const handleClearBill = () => {
    // Save snapshot for undo
    saveLastSnapshot(state);

    // Clear the bill
    setState((prev) => ({
      ...prev,
      items: [],
      payingEur: 0,
    }));

    // Show undo toast
    setShowUndo(true);

    // Auto-hide after 5 seconds
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      clearLastSnapshot();
    }, 5000);
  };

  const handleUndo = () => {
    const snapshot = loadLastSnapshot();
    if (snapshot) {
      setState(snapshot);
      clearLastSnapshot();
    }
    setShowUndo(false);
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
  };

  const handleDismissUndo = () => {
    setShowUndo(false);
    clearLastSnapshot();
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar
        rate={state.rate.bgnPerEur}
        onRateChange={handleRateChange}
        lang={state.lang}
        onLangChange={handleLangChange}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column: Add item + Bill list */}
          <div className="space-y-6">
            <AddItemForm
              rate={state.rate}
              lang={state.lang}
              onAddItem={handleAddItem}
            />
            <BillList
              items={state.items}
              rate={state.rate}
              lang={state.lang}
              onDeleteItem={handleDeleteItem}
            />
          </div>

          {/* Right column: Totals + Payment */}
          <div className="space-y-6">
            <TotalsPanel
              totalBgn={totalBgn}
              totalEur={totalEur}
              lang={state.lang}
            />
            <PaymentPanel
              totalEur={totalEur}
              payingEur={state.payingEur}
              onPayingChange={handlePayingChange}
              lang={state.lang}
            />

            {state.items.length > 0 && (
              <>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => setShowBasketModal(true)}
                >
                  <ShoppingBasket className="h-5 w-5" />
                  {t("viewBasket", state.lang)}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleClearBill}
                >
                  <Trash2 className="h-5 w-5" />
                  {t("clearBill", state.lang)}
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Undo toast */}
      <UndoToast
        show={showUndo}
        lang={state.lang}
        onUndo={handleUndo}
        onDismiss={handleDismissUndo}
      />

      {/* Basket summary modal */}
      <BasketSummaryModal
        isOpen={showBasketModal}
        onClose={() => setShowBasketModal(false)}
        items={state.items}
        rate={state.rate}
        totalBgn={totalBgn}
        totalEur={totalEur}
        lang={state.lang}
      />
    </div>
  );
}

