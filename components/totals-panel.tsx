"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/money";
import { t, type Lang } from "@/lib/i18n";

interface TotalsPanelProps {
  totalBgn: number;
  totalEur: number;
  lang: Lang;
}

export function TotalsPanel({ totalBgn, totalEur, lang }: TotalsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("total", lang)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">BGN:</span>
          <span className="text-2xl font-bold">
            {formatMoney(totalBgn, "BGN", lang)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between items-baseline">
          <span className="text-muted-foreground">EUR:</span>
          <span className="text-2xl font-bold text-primary">
            {formatMoney(totalEur, "EUR", lang)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

