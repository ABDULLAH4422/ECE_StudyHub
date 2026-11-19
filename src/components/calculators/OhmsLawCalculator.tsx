import React, { useState } from "react";
import { Zap, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type TargetParameter = "V" | "I" | "R";

export function OhmsLawCalculator() {
  const [target, setTarget] = useState<TargetParameter>("V");
  const [val1, setVal1] = useState<string>("0.5"); // e.g. Current I (A)
  const [val2, setVal2] = useState<string>("24");  // e.g. Resistance R (Ω)
  const [unit1, setUnit1] = useState<number>(1);
  const [unit2, setUnit2] = useState<number>(1);

  const [result, setResult] = useState<{
    value: string;
    unit: string;
    formula: string;
    power?: string;
  } | null>({
    value: "12.000",
    unit: "V",
    formula: "V = I × R",
    power: "6.000 W",
  });
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const n1 = parseFloat(val1);
    const n2 = parseFloat(val2);

    if (isNaN(n1) || isNaN(n2)) {
      setError("Please enter valid numerical values for both parameters.");
      setResult(null);
      return;
    }

    if (n1 < 0 || n2 < 0) {
      setError("Values must be positive or zero.");
      setResult(null);
      return;
    }

    const real1 = n1 * unit1;
    const real2 = n2 * unit2;

    if (target === "V") {
      // Calculate Voltage: V = I * R
      const I = real1;
      const R = real2;
      const V = I * R;
      const P = V * I;
      setResult({
        value: V >= 1000 ? (V / 1000).toFixed(4) : V.toFixed(4),
        unit: V >= 1000 ? "kV" : "V",
        formula: "V = I × R",
        power: `${P >= 1000 ? (P / 1000).toFixed(4) + " kW" : P.toFixed(4) + " W"}`,
      });
    } else if (target === "I") {
      // Calculate Current: I = V / R
      const V = real1;
      const R = real2;
      if (R === 0) {
        setError("Resistance (R) cannot be zero (division by zero).");
        setResult(null);
        return;
      }
      const I = V / R;
      const P = V * I;
      setResult({
        value: I < 0.001 ? (I * 1000000).toFixed(3) : I < 1 ? (I * 1000).toFixed(3) : I.toFixed(4),
        unit: I < 0.001 ? "µA" : I < 1 ? "mA" : "A",
        formula: "I = V / R",
        power: `${P >= 1000 ? (P / 1000).toFixed(4) + " kW" : P.toFixed(4) + " W"}`,
      });
    } else if (target === "R") {
      // Calculate Resistance: R = V / I
      const V = real1;
      const I = real2;
      if (I === 0) {
        setError("Current (I) cannot be zero (division by zero).");
        setResult(null);
        return;
      }
      const R = V / I;
      const P = V * I;
      setResult({
        value: R >= 1000000 ? (R / 1000000).toFixed(4) : R >= 1000 ? (R / 1000).toFixed(4) : R.toFixed(4),
        unit: R >= 1000000 ? "MΩ" : R >= 1000 ? "kΩ" : "Ω",
        formula: "R = V / I",
        power: `${P >= 1000 ? (P / 1000).toFixed(4) + " kW" : P.toFixed(4) + " W"}`,
      });
    }
  };

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Ohm's Law Calculator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Compute Voltage, Current, or Resistance with related electric power
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            V = I × R
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Mode Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Select Target Parameter to Calculate</Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setTarget("V");
                setVal1("0.5");
                setVal2("24");
                setUnit1(1);
                setUnit2(1);
                setError(null);
              }}
              className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                target === "V"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Voltage (V)
            </button>
            <button
              type="button"
              onClick={() => {
                setTarget("I");
                setVal1("12");
                setVal2("24");
                setUnit1(1);
                setUnit2(1);
                setError(null);
              }}
              className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                target === "I"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Current (I)
            </button>
            <button
              type="button"
              onClick={() => {
                setTarget("R");
                setVal1("12");
                setVal2("0.5");
                setUnit1(1);
                setUnit2(1);
                setError(null);
              }}
              className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                target === "R"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              Resistance (R)
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Input 1 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {target === "V" ? "Current (I)" : "Voltage (V)"}
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                placeholder="Enter value..."
                className="h-9 text-xs bg-muted/30"
              />
              <select
                value={unit1}
                onChange={(e) => setUnit1(parseFloat(e.target.value))}
                className="h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
              >
                {target === "V" ? (
                  <>
                    <option value={1}>A</option>
                    <option value={0.001}>mA</option>
                    <option value={0.000001}>µA</option>
                  </>
                ) : (
                  <>
                    <option value={1}>V</option>
                    <option value={0.001}>mV</option>
                    <option value={1000}>kV</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Input 2 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              {target === "V" ? "Resistance (R)" : target === "I" ? "Resistance (R)" : "Current (I)"}
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
                placeholder="Enter value..."
                className="h-9 text-xs bg-muted/30"
              />
              <select
                value={unit2}
                onChange={(e) => setUnit2(parseFloat(e.target.value))}
                className="h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
              >
                {target === "R" ? (
                  <>
                    <option value={1}>A</option>
                    <option value={0.001}>mA</option>
                    <option value={0.000001}>µA</option>
                  </>
                ) : (
                  <>
                    <option value={1}>Ω</option>
                    <option value={1000}>kΩ</option>
                    <option value={1000000}>MΩ</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Calculate Action */}
        <Button onClick={handleCalculate} className="w-full text-xs font-medium h-9">
          Calculate
        </Button>

        {/* Error Indicator */}
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Final Result Card */}
        {result && !error && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/80 space-y-3">
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
                  {result.value}
                </span>
                <span className="text-sm font-semibold text-primary ml-1.5 font-mono">
                  {result.unit}
                </span>
              </div>
              {result.power && (
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block font-mono">Electric Power</span>
                  <span className="text-xs font-bold font-mono text-foreground">
                    {result.power}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
