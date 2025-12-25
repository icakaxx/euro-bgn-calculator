"use client";

import * as React from "react";
import { X, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BillItem, CurrencyRate } from "@/lib/types";
import { calcItemTotals } from "@/lib/bill";
import { formatMoney } from "@/lib/money";
import { t, type Lang } from "@/lib/i18n";

interface BasketSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BillItem[];
  rate: CurrencyRate;
  totalBgn: number;
  totalEur: number;
  lang: Lang;
}

export function BasketSummaryModal({
  isOpen,
  onClose,
  items,
  rate,
  totalBgn,
  totalEur,
  lang,
}: BasketSummaryModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBasket className="h-5 w-5" />
              {t("basketSummary", lang)}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBasket className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">{t("noItems", lang)}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item, index) => {
                    const { lineBgn, lineEur, meta } = calcItemTotals(item, rate);
                    const displayName = item.name || `${t("item", lang)} #${index + 1}`;

                    let details = "";
                    if (item.type === "unit") {
                      const unitPriceStr = formatMoney(item.unitPriceBgn, "BGN", lang);
                      details = `${item.qty} × ${unitPriceStr}`;
                    } else if (item.type === "weight") {
                      const pricePerKgStr = formatMoney(item.pricePerKgBgn, "BGN", lang);
                      details = `${meta} × ${pricePerKgStr}/${t("kg", lang)}`;
                    }

                    return (
                      <div key={item.id} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{displayName}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {details}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-semibold">
                              {formatMoney(lineBgn, "BGN", lang)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatMoney(lineEur, "EUR", lang)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">{t("total", lang)} (BGN):</span>
                    <span className="font-bold text-xl">
                      {formatMoney(totalBgn, "BGN", lang)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">{t("total", lang)} (EUR):</span>
                    <span className="font-bold text-xl text-primary">
                      {formatMoney(totalEur, "EUR", lang)}
                    </span>
                  </div>
                </div>

                {/* Item Count */}
                <div className="text-center text-sm text-muted-foreground pt-2">
                  {items.length} {t("itemsInBasket", lang)}
                </div>
              </div>
            )}
          </CardContent>

          <div className="border-t p-4">
            <Button onClick={onClose} className="w-full" size="lg">
              {t("close", lang)}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

