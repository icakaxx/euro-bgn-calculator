"use client";

import * as React from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatMoney, parseNumberFlexible } from "@/lib/money";
import { calcChange } from "@/lib/bill";
import { t, type Lang } from "@/lib/i18n";

interface PaymentPanelProps {
  totalEur: number;
  payingEur: number;
  onPayingChange: (amount: number) => void;
  lang: Lang;
}

export function PaymentPanel({
  totalEur,
  payingEur,
  onPayingChange,
  lang,
}: PaymentPanelProps) {
  const [inputValue, setInputValue] = React.useState(payingEur.toString());

  // Update input when payingEur changes externally
  React.useEffect(() => {
    setInputValue(payingEur > 0 ? payingEur.toString() : "");
  }, [payingEur]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parsed = parseNumberFlexible(value);
    if (parsed !== null && parsed >= 0) {
      onPayingChange(parsed);
    } else if (value === "") {
      onPayingChange(0);
    }
  };

  const { changeEur, remainingEur } = calcChange(payingEur, totalEur);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          {t("paying", lang)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="paying">{t("paying", lang)} (EUR)</Label>
          <Input
            id="paying"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="0.00"
            className="mt-1.5 text-lg font-semibold"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("total", lang)}:</span>
            <span className="font-semibold">
              {formatMoney(totalEur, "EUR", lang)}
            </span>
          </div>

          {remainingEur > 0 ? (
            <div className="flex justify-between items-center p-3 rounded-md bg-destructive/10 text-destructive">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                <span className="font-medium">{t("remaining", lang)}:</span>
              </div>
              <span className="text-lg font-bold">
                {formatMoney(remainingEur, "EUR", lang)}
              </span>
            </div>
          ) : changeEur > 0 ? (
            <div className="flex justify-between items-center p-3 rounded-md bg-green-500/10 text-green-700 dark:text-green-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{t("change", lang)}:</span>
              </div>
              <span className="text-lg font-bold">
                {formatMoney(changeEur, "EUR", lang)}
              </span>
            </div>
          ) : payingEur > 0 ? (
            <div className="flex justify-between items-center p-3 rounded-md bg-muted">
              <span className="font-medium">{t("change", lang)}:</span>
              <span className="text-lg font-bold">
                {formatMoney(0, "EUR", lang)}
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

