import React, { useState } from "react";
import { GitCommit, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function VoltageDividerCalculator() {
  const [vin, setVin] = useState<string>("12");
  const [r1, setR1] = useState<string>("10");
  const [r1Unit, setR1Unit] = useState<number>(1000); // Default 10 kΩ

  const [r2, setR2] = useState<string>("10");
  const [r2Unit, setR2Unit] = useState<number>(1000); // Default 10 kΩ

  const [result, setResult] = useState<{
    vout: string;
    voutUnit: string;
    ratio: string;
    current: string;
    formula: string;
  } | null>({
    vout: "6.000",
    voutUnit: "V",
    ratio: "0.500 (50.0%)",
    current: "0.600 mA",
    formula: "Vout = Vin × [R₂ / (R₁ + R₂)]",
  });
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const v = parseFloat(vin);
    const nR1 = parseFloat(r1);
    const nR2 = parseFloat(r2);

    if (isNaN(v) || isNaN(nR1) || isNaN(nR2)) {
      setError("Please enter valid numerical values for all fields.");
      setResult(null);
      return;
    }

    if (nR1 < 0 || nR2 < 0) {
      setError("Resistor values cannot be negative.");
      setResult(null);
      return;
    }

    const realR1 = nR1 * r1Unit;
    const realR2 = nR2 * r2Unit;

    const totalR = realR1 + realR2;
    if (totalR === 0) {
      setError("Total series resistance (R₁ + R₂) cannot be zero.");
      setResult(null);
      return;
    }

    const voutVal = v * (realR2 / totalR);
    const ratioVal = realR2 / totalR;
    const currentA = v / totalR;

    // Format Vout
    let formattedVout = "";
    let voutUnitStr = "V";
    if (Math.abs(voutVal) < 0.001 && voutVal !== 0) {
      formattedVout = (voutVal * 1000).toFixed(4);
      voutUnitStr = "mV";
    } else {
      formattedVout = voutVal.toFixed(4);
      voutUnitStr = "V";
    }

    // Format current
    let currentStr = "";
    if (currentA >= 1) {
      currentStr = `${currentA.toFixed(3)} A`;
    } else if (currentA >= 0.001) {
      currentStr = `${(currentA * 1000).toFixed(3)} mA`;
    } else {
      currentStr = `${(currentA * 1000000).toFixed(3)} µA`;
    }

    setResult({
      vout: formattedVout,
      voutUnit: voutUnitStr,
      ratio: `${ratioVal.toFixed(3)} (${(ratioVal * 100).toFixed(1)}%)`,
      current: currentStr,
      formula: "Vout = Vin × [R₂ / (R₁ + R₂)]",
    });
  };

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Voltage Divider Calculator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Calculate divided output voltage across R₂ in a dual-resistor series circuit
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            Vout = Vin × [R₂/(R₁+R₂)]
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Input Voltage */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Source Voltage (Vin)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="e.g. 12"
                className="h-9 text-xs bg-muted/30"
              />
              <span className="h-9 px-3 text-xs bg-muted/40 border border-input rounded-md text-muted-foreground flex items-center justify-center font-mono">
                V
              </span>
            </div>
          </div>

          {/* Resistor R1 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Resistor 1 (R₁)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                min="0"
                value={r1}
                onChange={(e) => setR1(e.target.value)}
                placeholder="e.g. 10"
                className="h-9 text-xs bg-muted/30"
              />
              <select
                value={r1Unit}
                onChange={(e) => setR1Unit(parseFloat(e.target.value))}
                className="h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
              >
                <option value={1}>Ω</option>
                <option value={1000}>kΩ</option>
                <option value={1000000}>MΩ</option>
              </select>
            </div>
          </div>

          {/* Resistor R2 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Resistor 2 (R₂)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                min="0"
                value={r2}
                onChange={(e) => setR2(e.target.value)}
                placeholder="e.g. 10"
                className="h-9 text-xs bg-muted/30"
              />
              <select
                value={r2Unit}
                onChange={(e) => setR2Unit(parseFloat(e.target.value))}
                className="h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
              >
                <option value={1}>Ω</option>
                <option value={1000}>kΩ</option>
                <option value={1000000}>MΩ</option>
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
                <span className="text-[11px] text-muted-foreground block font-mono">Output Voltage (Vout)</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {result.vout}
                </span>
                <span className="text-sm font-semibold text-primary ml-1.5 font-mono">
                  {result.voutUnit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block font-mono">Divider Ratio</span>
                <span className="text-xs font-bold font-mono text-foreground">
                  {result.ratio}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono mt-0.5">
                  Quiescent Current: {result.current}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
