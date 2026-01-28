"use client";

import * as React from "react";
import { ArrowDownUp } from "lucide-react";
import { HeaderBar } from "@/components/header-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { detectLanguage, type Lang } from "@/lib/i18n";

const OFFICIAL_RATE = 1.95583;

type Currency = "EUR" | "BGN";

interface CurrencyConverterProps {
  rate: number;
  lang: Lang;
}

function CurrencyConverter({ rate, lang }: CurrencyConverterProps) {
  const [topCurrency, setTopCurrency] = React.useState<Currency>("EUR");
  const [topAmount, setTopAmount] = React.useState<string>("1");

  const bottomCurrency: Currency = topCurrency === "EUR" ? "BGN" : "EUR";

  const parsedTop = parseFloat(topAmount.replace(",", "."));
  const hasValidNumber = !Number.isNaN(parsedTop);

  const converted = hasValidNumber
    ? topCurrency === "EUR"
      ? parsedTop * rate
      : parsedTop / rate
    : 0;

  const formattedBottom = hasValidNumber ? converted.toFixed(2) : "";

  const handleSwapCurrencies = () => {
    setTopCurrency((prev) => (prev === "EUR" ? "BGN" : "EUR"));
  };

  const labelFrom =
    lang === "bg" ? "Сума" : "Amount";
  const labelTo =
    lang === "bg" ? "Резултат" : "Result";
  const eurLabel = lang === "bg" ? "Евро (EUR)" : "Euro (EUR)";
  const bgnLabel = lang === "bg" ? "Лева (BGN)" : "Leva (BGN)";

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {lang === "bg"
            ? "Калкулатор Евро ↔ Лева"
            : "EUR ↔ BGN Calculator"}
        </CardTitle>
        <CardDescription className="text-center">
          {lang === "bg"
            ? `Официален курс 1 EUR = ${rate.toFixed(5)} BGN`
            : `Official rate 1 EUR = ${rate.toFixed(5)} BGN`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="top-amount">
                {labelFrom}{" "}
                <span className="font-semibold">
                  {topCurrency === "EUR" ? eurLabel : bgnLabel}
                </span>
              </Label>
              <Input
                id="top-amount"
                type="text"
                inputMode="decimal"
                value={topAmount}
                onChange={(e) => setTopAmount(e.target.value)}
                placeholder={lang === "bg" ? "Въведете сума" : "Enter amount"}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant={topCurrency === "EUR" ? "default" : "outline"}
                size="sm"
                onClick={() => setTopCurrency("EUR")}
              >
                EUR
              </Button>
              <Button
                type="button"
                variant={topCurrency === "BGN" ? "default" : "outline"}
                size="sm"
                onClick={() => setTopCurrency("BGN")}
              >
                BGN
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSwapCurrencies}
            title={
              lang === "bg"
                ? "Размени Евро и Лева"
                : "Swap EUR and BGN"
            }
          >
            <ArrowDownUp className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bottom-amount">
            {labelTo}{" "}
            <span className="font-semibold">
              {bottomCurrency === "EUR" ? eurLabel : bgnLabel}
            </span>
          </Label>
          <Input
            id="bottom-amount"
            type="text"
            readOnly
            value={formattedBottom}
            placeholder="0.00"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [lang, setLang] = React.useState<Lang>(() => detectLanguage());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Калкулатор Лева Евро - EuroBG Elka",
            "alternateName": [
              "Калкулатор Лев Евро",
              "Лева Евро Калкулатор", 
              "BGN EUR Калкулатор",
              "Официален Калкулатор Лев Евро",
              "Калкулатор за Пазаруване в Евро",
              "Калкулатор Ресто Евро"
            ],
            "description": "Калкулатор лева евро с официален курс лев евро 1.95583. Лева в евро, левове в евро, БГН евро. Калкулатор за пазаруване в евро, ресто в евро, плащане в евро, двойно обозначаване на цени.",
            "url": "https://eurobg-elka.vercel.app",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "featureList": [
              "Калкулатор лева евро",
              "Официален курс лев евро 1.95583",
              "Лева в евро конверсия",
              "Левове в евро",
              "BGN EUR калкулатор",
              "Калкулатор за пазаруване в евро",
              "Калкулатор ресто в евро",
              "Плащане в евро калкулатор",
              "Цени в евро",
              "Двойно обозначаване на цени",
              "Смятане лев евро",
              "Преизчисляване лев евро",
              "Добавяне на артикули по тегло",
              "Работи офлайн"
            ],
            "inLanguage": ["bg", "en"],
            "availableLanguage": ["bg", "en"]
          })
        }}
      />

      <HeaderBar lang={lang} onLangChange={setLang} />

      <main className="flex-1 flex items-center">
        <section className="w-full container mx-auto px-4 py-8">
          <CurrencyConverter rate={OFFICIAL_RATE} lang={lang} />
        </section>
      </main>
    </div>
  );
}
