import React, { useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function RCTimeConstantCalculator() {
  const [resistance, setResistance] = useState<string>("10");
  const [resUnit, setResUnit] = useState<number>(1000); // Default 10 kΩ

  const [capacitance, setCapacitance] = useState<string>("100");
  const [capUnit, setCapUnit] = useState<number>(0.000000001); // Default 100 nF

  const [result, setResult] = useState<{
    tau: string;
    tauUnit: string;
    cutoff: string;
    fiveTau: string;
    formula: string;
  } | null>({
    tau: "1.000",
    tauUnit: "ms",
    cutoff: "159.155 Hz",
    fiveTau: "5.000 ms",
    formula: "τ = R × C",
  });
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    const r = parseFloat(resistance);
    const c = parseFloat(capacitance);

    if (isNaN(r) || isNaN(c)) {
      setError("Please enter valid numerical values for resistance and capacitance.");
      setResult(null);
      return;
    }

    if (r <= 0 || c <= 0) {
      setError("Resistance and capacitance must be greater than zero.");
      setResult(null);
      return;
    }

    const realR = r * resUnit;
    const realC = c * capUnit;

    const tauSec = realR * realC;
    const cutoffHz = 1 / (2 * Math.PI * tauSec);
    const fiveTauSec = 5 * tauSec;

    // Format Tau nicely
    let formattedTau = "";
    let tauUnitStr = "";
    if (tauSec >= 1) {
      formattedTau = tauSec.toFixed(4);
      tauUnitStr = "s";
    } else if (tauSec >= 0.001) {
      formattedTau = (tauSec * 1000).toFixed(4);
      tauUnitStr = "ms";
    } else if (tauSec >= 0.000001) {
      formattedTau = (tauSec * 1000000).toFixed(4);
      tauUnitStr = "µs";
    } else {
      formattedTau = (tauSec * 1000000000).toFixed(4);
      tauUnitStr = "ns";
    }

    // Format 5 Tau (Time to 99.3% charge)
    let formatted5Tau = "";
    if (fiveTauSec >= 1) {
      formatted5Tau = `${fiveTauSec.toFixed(4)} s`;
    } else if (fiveTauSec >= 0.001) {
      formatted5Tau = `${(fiveTauSec * 1000).toFixed(4)} ms`;
    } else if (fiveTauSec >= 0.000001) {
      formatted5Tau = `${(fiveTauSec * 1000000).toFixed(4)} µs`;
    } else {
      formatted5Tau = `${(fiveTauSec * 1000000000).toFixed(4)} ns`;
    }

    // Format Cutoff Frequency
    let formattedCutoff = "";
    if (cutoffHz >= 1000000) {
      formattedCutoff = `${(cutoffHz / 1000000).toFixed(3)} MHz`;
    } else if (cutoffHz >= 1000) {
      formattedCutoff = `${(cutoffHz / 1000).toFixed(3)} kHz`;
    } else {
      formattedCutoff = `${cutoffHz.toFixed(3)} Hz`;
    }

    setResult({
      tau: formattedTau,
      tauUnit: tauUnitStr,
      cutoff: formattedCutoff,
      fiveTau: formatted5Tau,
      formula: "τ = R × C",
    });
  };

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                RC Time Constant Calculator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Calculate RC charging/discharging time constant (τ) and -3dB cutoff frequency
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            τ = R × C
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Resistance Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Resistance (R)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                min="0"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                placeholder="e.g. 10"
                className="h-9 text-xs bg-muted/30"
              />
              <select
                value={resUnit}
                onChange={(e) => setResUnit(parseFloat(e.target.value))}
                className="h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
              >
                <option value={1}>Ω</option>
                <option value={1000}>kΩ</option>
                <option value={1000000}>MΩ</option>
              </select>
            </div>
          </div>

          {/* Capacitance Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">Capacitance (C)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                min="0"
                value={capacitance}
                onChange={(e) => setCapacitance(e.target.value)}
                placeholder="e.g. 100"
                className="h-9 text-xs bg-muted/30"
              />
              <select
                value={capUnit}
                onChange={(e) => setCapUnit(parseFloat(e.target.value))}
                className="h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
              >
                <option value={0.000000000001}>pF</option>
                <option value={0.000000001}>nF</option>
                <option value={0.000001}>µF</option>
                <option value={0.001}>mF</option>
                <option value={1}>F</option>
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
                <span className="text-[11px] text-muted-foreground block font-mono">Time Constant (τ)</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {result.tau}
                </span>
                <span className="text-sm font-semibold text-primary ml-1.5 font-mono">
                  {result.tauUnit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block font-mono">Cutoff Freq (fc)</span>
                <span className="text-xs font-bold font-mono text-foreground">
                  {result.cutoff}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono mt-0.5">
                  5τ (99.3%): {result.fiveTau}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
