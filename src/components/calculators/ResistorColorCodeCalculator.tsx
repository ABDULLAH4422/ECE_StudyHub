import React, { useState } from "react";
import { SlidersHorizontal, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ColorItem {
  name: string;
  value: number;
  multiplier: number;
  tolerance?: number;
  bgHex: string;
  textDark?: boolean;
}

const COLORS: ColorItem[] = [
  { name: "Black", value: 0, multiplier: 1, bgHex: "#18181b", textDark: false },
  { name: "Brown", value: 1, multiplier: 10, tolerance: 1, bgHex: "#854d0e", textDark: false },
  { name: "Red", value: 2, multiplier: 100, tolerance: 2, bgHex: "#dc2626", textDark: false },
  { name: "Orange", value: 3, multiplier: 1000, bgHex: "#ea580c", textDark: false },
  { name: "Yellow", value: 4, multiplier: 10000, bgHex: "#ca8a04", textDark: true },
  { name: "Green", value: 5, multiplier: 100000, tolerance: 0.5, bgHex: "#16a34a", textDark: false },
  { name: "Blue", value: 6, multiplier: 1000000, tolerance: 0.25, bgHex: "#2563eb", textDark: false },
  { name: "Violet", value: 7, multiplier: 10000000, tolerance: 0.1, bgHex: "#9333ea", textDark: false },
  { name: "Gray", value: 8, multiplier: 100000000, tolerance: 0.05, bgHex: "#64748b", textDark: false },
  { name: "White", value: 9, multiplier: 1000000000, bgHex: "#f8fafc", textDark: true },
  { name: "Gold", value: -1, multiplier: 0.1, tolerance: 5, bgHex: "#d97706", textDark: false },
  { name: "Silver", value: -2, multiplier: 0.01, tolerance: 10, bgHex: "#94a3b8", textDark: false },
];

export function ResistorColorCodeCalculator() {
  const [bandCount, setBandCount] = useState<4 | 5>(4);

  // Band selections
  const [band1, setBand1] = useState<number>(4); // Yellow (4)
  const [band2, setBand2] = useState<number>(7); // Violet (7)
  const [band3, setBand3] = useState<number>(2); // Red (for 5-band)
  const [multiplier, setMultiplier] = useState<number>(2); // Red (10^2)
  const [tolerance, setTolerance] = useState<number>(10); // Gold (±5%)

  const [result, setResult] = useState<{
    resistance: string;
    tolerance: string;
    formula: string;
  } | null>({
    resistance: "4.7 kΩ",
    tolerance: "±5%",
    formula: "R = (Band₁ × 10 + Band₂) × Multiplier",
  });

  const handleCalculate = () => {
    const c1 = COLORS[band1];
    const c2 = COLORS[band2];
    const mult = COLORS[multiplier];
    const tol = COLORS[tolerance];

    if (!c1 || !c2 || !mult || !tol) return;

    let baseValue = 0;
    let formula = "";

    if (bandCount === 4) {
      baseValue = (c1.value * 10 + c2.value) * mult.multiplier;
      formula = "R = (Band₁ × 10 + Band₂) × Multiplier";
    } else {
      const c3 = COLORS[band3];
      if (!c3) return;
      baseValue = (c1.value * 100 + c2.value * 10 + c3.value) * mult.multiplier;
      formula = "R = (Band₁ × 100 + Band₂ × 10 + Band₃) × Multiplier";
    }

    let formatted = "";
    if (baseValue >= 1000000) {
      formatted = `${(baseValue / 1000000).toLocaleString(undefined, { maximumFractionDigits: 3 })} MΩ`;
    } else if (baseValue >= 1000) {
      formatted = `${(baseValue / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })} kΩ`;
    } else {
      formatted = `${baseValue.toLocaleString(undefined, { maximumFractionDigits: 3 })} Ω`;
    }

    setResult({
      resistance: formatted,
      tolerance: `±${tol.tolerance ?? 5}%`,
      formula,
    });
  };

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Resistor Color Code Calculator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Determine resistance value & tolerance for 4-Band or 5-Band axial resistors
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {bandCount}-Band Standard
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Band Count Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Resistor Type</Label>
          <div className="flex gap-1.5 p-0.5 rounded-md bg-muted/50 border border-border/60">
            <button
              type="button"
              onClick={() => {
                setBandCount(4);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                bandCount === 4
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              4-Band
            </button>
            <button
              type="button"
              onClick={() => {
                setBandCount(5);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                bandCount === 5
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              5-Band
            </button>
          </div>
        </div>

        {/* Visual Resistor Graphic */}
        <div className="p-4 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-center">
          <div className="relative flex items-center h-10 w-64 bg-[#e2d9c8] dark:bg-[#3f3b33] rounded-md border border-[#c7bcab] dark:border-[#5a5449] shadow-inner justify-around px-4">
            <div
              className="h-full w-2.5 rounded-xs"
              style={{ backgroundColor: COLORS[band1]?.bgHex }}
              title={`Band 1: ${COLORS[band1]?.name}`}
            />
            <div
              className="h-full w-2.5 rounded-xs"
              style={{ backgroundColor: COLORS[band2]?.bgHex }}
              title={`Band 2: ${COLORS[band2]?.name}`}
            />
            {bandCount === 5 && (
              <div
                className="h-full w-2.5 rounded-xs"
                style={{ backgroundColor: COLORS[band3]?.bgHex }}
                title={`Band 3: ${COLORS[band3]?.name}`}
              />
            )}
            <div
              className="h-full w-2.5 rounded-xs"
              style={{ backgroundColor: COLORS[multiplier]?.bgHex }}
              title={`Multiplier: ${COLORS[multiplier]?.name}`}
            />
            <div
              className="h-full w-2.5 rounded-xs ml-4"
              style={{ backgroundColor: COLORS[tolerance]?.bgHex }}
              title={`Tolerance: ${COLORS[tolerance]?.name}`}
            />
          </div>
        </div>

        {/* Color Selectors */}
        <div className={`grid grid-cols-2 sm:grid-cols-${bandCount === 5 ? "5" : "4"} gap-3`}>
          {/* Band 1 */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">1st Band</Label>
            <select
              value={band1}
              onChange={(e) => setBand1(parseInt(e.target.value))}
              className="w-full h-8 text-xs bg-muted/40 border border-input rounded-md px-2 text-foreground focus:outline-hidden"
            >
              {COLORS.filter((c) => c.value >= 1 && c.value <= 9).map((c, i) => (
                <option key={c.name} value={COLORS.indexOf(c)}>
                  {c.value} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Band 2 */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">2nd Band</Label>
            <select
              value={band2}
              onChange={(e) => setBand2(parseInt(e.target.value))}
              className="w-full h-8 text-xs bg-muted/40 border border-input rounded-md px-2 text-foreground focus:outline-hidden"
            >
              {COLORS.filter((c) => c.value >= 0 && c.value <= 9).map((c) => (
                <option key={c.name} value={COLORS.indexOf(c)}>
                  {c.value} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Band 3 (Only for 5-Band) */}
          {bandCount === 5 && (
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">3rd Band</Label>
              <select
                value={band3}
                onChange={(e) => setBand3(parseInt(e.target.value))}
                className="w-full h-8 text-xs bg-muted/40 border border-input rounded-md px-2 text-foreground focus:outline-hidden"
              >
                {COLORS.filter((c) => c.value >= 0 && c.value <= 9).map((c) => (
                  <option key={c.name} value={COLORS.indexOf(c)}>
                    {c.value} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Multiplier Band */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">Multiplier</Label>
            <select
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value))}
              className="w-full h-8 text-xs bg-muted/40 border border-input rounded-md px-2 text-foreground focus:outline-hidden"
            >
              {COLORS.map((c, idx) => (
                <option key={c.name} value={idx}>
                  × {c.multiplier >= 1 ? c.multiplier.toLocaleString() : c.multiplier} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Tolerance Band */}
          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">Tolerance</Label>
            <select
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
              className="w-full h-8 text-xs bg-muted/40 border border-input rounded-md px-2 text-foreground focus:outline-hidden"
            >
              {COLORS.filter((c) => c.tolerance !== undefined).map((c) => (
                <option key={c.name} value={COLORS.indexOf(c)}>
                  ±{c.tolerance}% ({c.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculate Action */}
        <Button onClick={handleCalculate} className="w-full text-xs font-medium h-9">
          Calculate
        </Button>

        {/* Final Result Card */}
        {result && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Final Result
              </span>
              <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                Formula: {result.formula}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {result.resistance}
                </span>
                <span className="text-sm font-semibold text-primary ml-2 font-mono">
                  {result.tolerance}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
