"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Lang } from "@/lib/i18n";

interface LangToggleProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export function LangToggle({ lang, onLangChange }: LangToggleProps) {
  const nextLang = lang === "bg" ? "en" : "bg";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onLangChange(nextLang)}
      className="gap-2"
      aria-label={t("language", lang)}
    >
      <Languages className="h-4 w-4" />
      <span className="uppercase font-semibold">{nextLang}</span>
    </Button>
  );
}

