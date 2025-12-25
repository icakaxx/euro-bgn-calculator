"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillItemRow } from "@/components/bill-item-row";
import { BillItem, CurrencyRate } from "@/lib/types";
import { t, type Lang } from "@/lib/i18n";

interface BillListProps {
  items: BillItem[];
  rate: CurrencyRate;
  lang: Lang;
  onDeleteItem: (id: string) => void;
}

export function BillList({ items, rate, lang, onDeleteItem }: BillListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <span>
            {t("total", lang)} ({items.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">{t("noItems", lang)}</p>
            <p className="text-sm mt-1">{t("addFirstItem", lang)}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <BillItemRow
                key={item.id}
                item={item}
                index={index}
                rate={rate}
                lang={lang}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

