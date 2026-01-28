"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { t, type Lang } from "@/lib/i18n";

const OFFICIAL_RATE = 1.95583;

interface RateControlProps {
  lang: Lang;
}

export function RateControl({ lang }: RateControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="rate" className="text-sm font-medium">
          {t("exchangeRate", lang)}
        </Label>
      </div>
      <p className="text-sm font-semibold">
        1 EUR = {OFFICIAL_RATE.toFixed(5)} BGN
      </p>
      <p className="text-xs text-muted-foreground">
        {t("officialRate", lang)}
      </p>
    </div>
  );
}

