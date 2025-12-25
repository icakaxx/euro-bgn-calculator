"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { t, type Lang } from "@/lib/i18n";
import { parseNumberFlexible, formatMoney } from "@/lib/money";
import { CurrencyRate, UnitItem, WeightItem } from "@/lib/types";
import { generateId } from "@/lib/ids";

interface AddItemFormProps {
  rate: CurrencyRate;
  lang: Lang;
  onAddItem: (item: UnitItem | WeightItem) => void;
}

export function AddItemForm({ rate, lang, onAddItem }: AddItemFormProps) {
  const [mode, setMode] = React.useState<"unit" | "weight">("unit");
  
  // Currency input mode: which currency the user enters prices in
  const [inputCurrency, setInputCurrency] = React.useState<"BGN" | "EUR">("BGN");

  // Unit mode state
  const [unitName, setUnitName] = React.useState("");
  const [unitPrice, setUnitPrice] = React.useState("");
  const [unitQty, setUnitQty] = React.useState("1");

  // Weight mode state
  const [weightName, setWeightName] = React.useState("");
  const [pricePerKg, setPricePerKg] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("0");

  // Refs for auto-focus
  const unitPriceRef = React.useRef<HTMLInputElement>(null);
  const pricePerKgRef = React.useRef<HTMLInputElement>(null);

  // Validation errors
  const [unitPriceError, setUnitPriceError] = React.useState("");
  const [pricePerKgError, setPricePerKgError] = React.useState("");
  const [weightError, setWeightError] = React.useState("");

  // Calculate preview for unit mode
  const unitPreview = React.useMemo(() => {
    const price = parseNumberFlexible(unitPrice);
    const qty = parseNumberFlexible(unitQty);
    if (price && qty && price > 0 && qty > 0) {
      let totalBgn: number;
      let totalEur: number;
      
      if (inputCurrency === "BGN") {
        totalBgn = price * qty;
        totalEur = totalBgn / rate.bgnPerEur;
      } else {
        // Input is in EUR
        totalEur = price * qty;
        totalBgn = totalEur * rate.bgnPerEur;
      }
      
      return {
        bgn: formatMoney(totalBgn, "BGN", lang),
        eur: formatMoney(totalEur, "EUR", lang),
      };
    }
    return null;
  }, [unitPrice, unitQty, rate, lang, inputCurrency]);

  // Calculate preview for weight mode
  const weightPreview = React.useMemo(() => {
    const price = parseNumberFlexible(pricePerKg);
    const kgVal = parseNumberFlexible(weightKg);
    
    if (price && price > 0 && kgVal !== null && kgVal >= 0) {
      let totalBgn: number;
      let totalEur: number;
      
      if (inputCurrency === "BGN") {
        totalBgn = price * kgVal;
        totalEur = totalBgn / rate.bgnPerEur;
      } else {
        // Input is in EUR
        totalEur = price * kgVal;
        totalBgn = totalEur * rate.bgnPerEur;
      }
      
      return {
        weight: `${kgVal.toFixed(3)} ${t("kg", lang)}`,
        bgn: formatMoney(totalBgn, "BGN", lang),
        eur: formatMoney(totalEur, "EUR", lang),
      };
    }
    return null;
  }, [pricePerKg, weightKg, rate, lang, inputCurrency]);

  const handleAddUnit = () => {
    // Validate
    const price = parseNumberFlexible(unitPrice);
    const qty = parseNumberFlexible(unitQty);

    if (!price || price <= 0) {
      setUnitPriceError(t("priceMustBePositive", lang));
      return;
    }
    if (!qty || qty <= 0) {
      return;
    }

    setUnitPriceError("");

    // Convert to BGN if input was in EUR
    const unitPriceBgn = inputCurrency === "BGN" ? price : price * rate.bgnPerEur;

    // Create item
    const item: UnitItem = {
      id: generateId(),
      type: "unit",
      name: unitName.trim() || undefined,
      unitPriceBgn: unitPriceBgn,
      qty,
    };

    onAddItem(item);

    // Reset form but keep focus on price for quick entry
    setUnitName("");
    setUnitPrice("");
    setUnitQty("1");
    setTimeout(() => unitPriceRef.current?.focus(), 0);
  };

  const handleAddWeight = () => {
    // Validate
    const price = parseNumberFlexible(pricePerKg);
    const kgVal = parseNumberFlexible(weightKg);

    if (!price || price <= 0) {
      setPricePerKgError(t("priceMustBePositive", lang));
      return;
    }
    if (kgVal === null || kgVal <= 0) {
      setWeightError(t("weightMustBePositive", lang));
      return;
    }

    setPricePerKgError("");
    setWeightError("");

    // Convert to BGN if input was in EUR
    const pricePerKgBgn = inputCurrency === "BGN" ? price : price * rate.bgnPerEur;

    // Convert decimal kg to kg + grams for storage
    const totalKg = kgVal;
    const kg = Math.floor(totalKg);
    const grams = Math.round((totalKg - kg) * 1000);

    // Create item
    const item: WeightItem = {
      id: generateId(),
      type: "weight",
      name: weightName.trim() || undefined,
      pricePerKgBgn: pricePerKgBgn,
      kg: kg,
      grams: grams,
    };

    onAddItem(item);

    // Reset form but keep focus on price for quick entry
    setWeightName("");
    setPricePerKg("");
    setWeightKg("0");
    setTimeout(() => pricePerKgRef.current?.focus(), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("addItem", lang)}</span>
          {/* Currency selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground">
              {t("enterIn", lang)}:
            </span>
            <Button
              variant={inputCurrency === "BGN" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputCurrency("BGN")}
              className="h-8 px-3"
            >
              BGN
            </Button>
            <Button
              variant={inputCurrency === "EUR" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputCurrency("EUR")}
              className="h-8 px-3"
            >
              EUR
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "unit" | "weight")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="unit">{t("unit", lang)}</TabsTrigger>
            <TabsTrigger value="weight">{t("weight", lang)}</TabsTrigger>
          </TabsList>

          {/* Unit Mode */}
          <TabsContent value="unit" className="space-y-4">
            <div>
              <Label htmlFor="unit-name">
                {t("itemName", lang)}{" "}
                <span className="text-muted-foreground text-xs">
                  ({t("optional", lang)})
                </span>
              </Label>
              <Input
                id="unit-name"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder=""
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="unit-price">
                {t("unitPrice", lang)} ({inputCurrency}) *
              </Label>
              <Input
                ref={unitPriceRef}
                id="unit-price"
                type="text"
                value={unitPrice}
                onChange={(e) => {
                  setUnitPrice(e.target.value);
                  setUnitPriceError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUnit();
                  }
                }}
                placeholder="0.00"
                className="mt-1.5 text-lg font-semibold"
              />
              {unitPriceError && (
                <p className="text-xs text-destructive mt-1">{unitPriceError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unit-qty">{t("quantity", lang)}</Label>
              <Input
                id="unit-qty"
                type="text"
                value={unitQty}
                onChange={(e) => setUnitQty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUnit();
                  }
                }}
                placeholder="1"
                className="mt-1.5"
              />
            </div>

            {unitPreview && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="font-medium mb-1">{t("lineTotal", lang)}:</div>
                <div className="flex gap-3">
                  <span className="font-semibold">{unitPreview.bgn}</span>
                  <span className="text-muted-foreground">≈ {unitPreview.eur}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleAddUnit}
              className="w-full gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              {t("add", lang)}
            </Button>
          </TabsContent>

          {/* Weight Mode */}
          <TabsContent value="weight" className="space-y-4">
            <div>
              <Label htmlFor="weight-name">
                {t("itemName", lang)}{" "}
                <span className="text-muted-foreground text-xs">
                  ({t("optional", lang)})
                </span>
              </Label>
              <Input
                id="weight-name"
                value={weightName}
                onChange={(e) => setWeightName(e.target.value)}
                placeholder=""
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="price-per-kg">
                {t("pricePerKg", lang)} ({inputCurrency}/kg) *
              </Label>
              <Input
                ref={pricePerKgRef}
                id="price-per-kg"
                type="text"
                value={pricePerKg}
                onChange={(e) => {
                  setPricePerKg(e.target.value);
                  setPricePerKgError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddWeight();
                  }
                }}
                placeholder="0.00"
                className="mt-1.5 text-lg font-semibold"
              />
              {pricePerKgError && (
                <p className="text-xs text-destructive mt-1">{pricePerKgError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="weight-kg">{t("weight", lang)} ({t("kg", lang)}) *</Label>
              <Input
                id="weight-kg"
                type="text"
                value={weightKg}
                onChange={(e) => {
                  setWeightKg(e.target.value);
                  setWeightError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddWeight();
                  }
                }}
                placeholder="0.234"
                className="mt-1.5 text-lg font-semibold"
              />
              {weightError && (
                <p className="text-xs text-destructive mt-1">{weightError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {lang === "bg" ? "Например: 0.234 или 1.500" : "Example: 0.234 or 1.500"}
              </p>
            </div>

            {weightPreview && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="font-medium mb-1">
                  {weightPreview.weight}
                </div>
                <div className="font-medium mb-1">{t("lineTotal", lang)}:</div>
                <div className="flex gap-3">
                  <span className="font-semibold">{weightPreview.bgn}</span>
                  <span className="text-muted-foreground">≈ {weightPreview.eur}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleAddWeight}
              className="w-full gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              {t("add", lang)}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

