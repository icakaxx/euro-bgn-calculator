"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillItem, CurrencyRate } from "@/lib/types";
import { calcItemTotals } from "@/lib/bill";
import { formatMoney } from "@/lib/money";
import { t, type Lang } from "@/lib/i18n";

interface BillItemRowProps {
  item: BillItem;
  index: number;
  rate: CurrencyRate;
  lang: Lang;
  onDelete: (id: string) => void;
}

export function BillItemRow({
  item,
  index,
  rate,
  lang,
  onDelete,
}: BillItemRowProps) {
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
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{displayName}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{details}</div>
        <div className="flex gap-2 mt-1.5 text-sm">
          <span className="font-semibold">
            {formatMoney(lineBgn, "BGN", lang)}
          </span>
          <span className="text-muted-foreground">
            ≈ {formatMoney(lineEur, "EUR", lang)}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(item.id)}
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label="Delete item"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

