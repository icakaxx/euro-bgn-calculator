"use client";

import * as React from "react";
import { Trash2, ShoppingBasket, ArrowDownUp } from "lucide-react";
import { HeaderBar } from "@/components/header-bar";
import { AddItemForm } from "@/components/add-item-form";
import { BillList } from "@/components/bill-list";
import { TotalsPanel } from "@/components/totals-panel";
import { PaymentPanel } from "@/components/payment-panel";
import { UndoToast } from "@/components/undo-toast";
import { BasketSummaryModal } from "@/components/basket-summary-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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

type Currency = "EUR" | "BGN";

interface CurrencyConverterProps {
  rate: number;
  lang: Lang;
}

function CurrencyConverter({ rate, lang }: CurrencyConverterProps) {
  const [topCurrency, setTopCurrency] = React.useState<Currency>("EUR");
  const [topAmount, setTopAmount] = React.useState<string>("1");

  const bottomCurrency: Currency = topCurrency === "EUR" ? "BGN" : "EUR";

  const parsedTop = parseFloat(topAmount.replace(",", "."));
  const hasValidNumber = !Number.isNaN(parsedTop);

  const converted = hasValidNumber
    ? topCurrency === "EUR"
      ? parsedTop * rate
      : parsedTop / rate
    : 0;

  const formattedBottom = hasValidNumber ? converted.toFixed(2) : "";

  const handleSwapCurrencies = () => {
    setTopCurrency((prev) => (prev === "EUR" ? "BGN" : "EUR"));
  };

  const labelFrom =
    lang === "bg" ? "Сума" : "Amount";
  const labelTo =
    lang === "bg" ? "Резултат" : "Result";
  const eurLabel = lang === "bg" ? "Евро (EUR)" : "Euro (EUR)";
  const bgnLabel = lang === "bg" ? "Лева (BGN)" : "Leva (BGN)";

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {lang === "bg"
            ? "Калкулатор Евро ↔ Лева"
            : "EUR ↔ BGN Calculator"}
        </CardTitle>
        <CardDescription className="text-center">
          {lang === "bg"
            ? `Официален курс 1 EUR = ${rate.toFixed(5)} BGN`
            : `Official rate 1 EUR = ${rate.toFixed(5)} BGN`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="top-amount">
                {labelFrom}{" "}
                <span className="font-semibold">
                  {topCurrency === "EUR" ? eurLabel : bgnLabel}
                </span>
              </Label>
              <Input
                id="top-amount"
                type="text"
                inputMode="decimal"
                value={topAmount}
                onChange={(e) => setTopAmount(e.target.value)}
                placeholder={lang === "bg" ? "Въведете сума" : "Enter amount"}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant={topCurrency === "EUR" ? "default" : "outline"}
                size="sm"
                onClick={() => setTopCurrency("EUR")}
              >
                EUR
              </Button>
              <Button
                type="button"
                variant={topCurrency === "BGN" ? "default" : "outline"}
                size="sm"
                onClick={() => setTopCurrency("BGN")}
              >
                BGN
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSwapCurrencies}
            title={
              lang === "bg"
                ? "Размени Евро и Лева"
                : "Swap EUR and BGN"
            }
          >
            <ArrowDownUp className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bottom-amount">
            {labelTo}{" "}
            <span className="font-semibold">
              {bottomCurrency === "EUR" ? eurLabel : bgnLabel}
            </span>
          </Label>
          <Input
            id="bottom-amount"
            type="text"
            readOnly
            value={formattedBottom}
            placeholder="0.00"
          />
        </div>
      </CardContent>
    </Card>
  );
}

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
      // Force official rate even if storage has a different one
      return {
        ...loaded,
        rate: { bgnPerEur: OFFICIAL_RATE },
      };
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
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Калкулатор Лева Евро - EuroBG Elka",
            "alternateName": [
              "Калкулатор Лев Евро",
              "Лева Евро Калкулатор", 
              "BGN EUR Калкулатор",
              "Официален Калкулатор Лев Евро",
              "Калкулатор за Пазаруване в Евро",
              "Калкулатор Ресто Евро"
            ],
            "description": "Калкулатор лева евро с официален курс лев евро 1.95583. Лева в евро, левове в евро, БГН евро. Калкулатор за пазаруване в евро, ресто в евро, плащане в евро, двойно обозначаване на цени.",
            "url": "https://eurobg-elka.vercel.app",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "featureList": [
              "Калкулатор лева евро",
              "Официален курс лев евро 1.95583",
              "Лева в евро конверсия",
              "Левове в евро",
              "BGN EUR калкулатор",
              "Калкулатор за пазаруване в евро",
              "Калкулатор ресто в евро",
              "Плащане в евро калкулатор",
              "Цени в евро",
              "Двойно обозначаване на цени",
              "Смятане лев евро",
              "Преизчисляване лев евро",
              "Добавяне на артикули по тегло",
              "Работи офлайн"
            ],
            "inLanguage": ["bg", "en"],
            "availableLanguage": ["bg", "en"]
          })
        }}
      />

      <HeaderBar
        lang={state.lang}
        onLangChange={handleLangChange}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Section 1: Simple EUR ↔ BGN converter */}
        <section>
          <CurrencyConverter rate={state.rate.bgnPerEur} lang={state.lang} />
        </section>

        <Separator />

        {/* Section 2: Detailed shopping calculator */}
        <section>
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
        </section>
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
