"use client";

import * as React from "react";
import { Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { RateControl } from "@/components/rate-control";
import { t, type Lang } from "@/lib/i18n";

interface HeaderBarProps {
  rate: number;
  onRateChange: (rate: number) => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export function HeaderBar({
  rate,
  onRateChange,
  lang,
  onLangChange,
}: HeaderBarProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Calculator className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {t("appTitle", lang)}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle lang={lang} onLangChange={onLangChange} />
            <ThemeToggle lang={lang} />
          </div>
        </div>
        <RateControl rate={rate} onRateChange={onRateChange} lang={lang} />
      </div>
    </header>
  );
}

