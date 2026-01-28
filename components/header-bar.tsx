"use client";

import * as React from "react";
import { Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { RateControl } from "@/components/rate-control";
import { t, type Lang } from "@/lib/i18n";

interface HeaderBarProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export function HeaderBar({
  lang,
  onLangChange,
}: HeaderBarProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between">
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
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Създаден и проектиран от <span className="font-semibold">icakaxx</span> –{" "}
            <a
              href="https://www.hmwspro.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary"
            >
              виж всички мои уеб услуги
            </a>
          </p>
        </div>
        <RateControl lang={lang} />
      </div>
    </header>
  );
}

