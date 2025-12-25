"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { t, type Lang } from "@/lib/i18n";
import { parseNumberFlexible } from "@/lib/money";

const OFFICIAL_RATE = 1.95583;

interface RateControlProps {
  rate: number;
  onRateChange: (rate: number) => void;
  lang: Lang;
}

export function RateControl({ rate, onRateChange, lang }: RateControlProps) {
  const [inputValue, setInputValue] = React.useState(rate.toString());

  // Update input when rate changes externally
  React.useEffect(() => {
    setInputValue(rate.toString());
  }, [rate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const parsed = parseNumberFlexible(value);
    if (parsed && parsed > 0) {
      onRateChange(parsed);
    }
  };

  const handleReset = () => {
    onRateChange(OFFICIAL_RATE);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="rate" className="text-sm font-medium">
          {t("exchangeRate", lang)}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2 shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">{t("resetRate", lang)}</span>
        </Button>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          1 EUR =
        </span>
        <Input
          id="rate"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="pl-[4.5rem] text-base font-semibold"
          placeholder="1.95583"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          BGN
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("officialRate", lang)}
      </p>
    </div>
  );
}

