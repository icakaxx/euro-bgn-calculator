"use client";

import * as React from "react";
import { Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Lang } from "@/lib/i18n";

interface UndoToastProps {
  show: boolean;
  lang: Lang;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ show, lang, onUndo, onDismiss }: UndoToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3 bg-card border shadow-lg rounded-lg p-4 min-w-[300px]">
        <span className="text-sm font-medium flex-1">
          {t("billCleared", lang)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          className="gap-2"
        >
          <Undo2 className="h-4 w-4" />
          {t("undo", lang)}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

