import React, { useState } from "react";
import { Binary, AlertCircle, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type BaseType = "10" | "2" | "8" | "16";

export function NumberSystemConverter() {
  const [inputBase, setInputBase] = useState<BaseType>("10");
  const [inputValue, setInputValue] = useState<string>("255");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [result, setResult] = useState<{
    bin: string;
    dec: string;
    oct: string;
    hex: string;
    formula: string;
  } | null>({
    bin: "1111 1111",
    dec: "255",
    oct: "377",
    hex: "FF",
    formula: "N = ∑ (digit × Baseⁱ)",
  });
  const [error, setError] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleCalculate = () => {
    setError(null);
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError("Please enter a number to convert.");
      setResult(null);
      return;
    }

    // Validation patterns
    const binaryRegex = /^[01]+$/;
    const decimalRegex = /^[0-9]+$/;
    const octalRegex = /^[0-7]+$/;
    const hexRegex = /^[0-9a-fA-F]+$/;

    let decimalVal = 0;

    if (inputBase === "2") {
      const cleanBin = trimmed.replace(/\s+/g, "");
      if (!binaryRegex.test(cleanBin)) {
        setError("Invalid Binary number: only digits 0 and 1 are permitted.");
        setResult(null);
        return;
      }
      decimalVal = parseInt(cleanBin, 2);
    } else if (inputBase === "10") {
      if (!decimalRegex.test(trimmed)) {
        setError("Invalid Decimal number: only non-negative integers (0-9) are permitted.");
        setResult(null);
        return;
      }
      decimalVal = parseInt(trimmed, 10);
    } else if (inputBase === "8") {
      if (!octalRegex.test(trimmed)) {
        setError("Invalid Octal number: only digits 0 to 7 are permitted.");
        setResult(null);
        return;
      }
      decimalVal = parseInt(trimmed, 8);
    } else if (inputBase === "16") {
      const cleanHex = trimmed.replace(/^0x/i, "");
      if (!hexRegex.test(cleanHex)) {
        setError("Invalid Hexadecimal number: only characters 0-9 and A-F are permitted.");
        setResult(null);
        return;
      }
      decimalVal = parseInt(cleanHex, 16);
    }

    if (isNaN(decimalVal) || decimalVal < 0 || decimalVal > Number.MAX_SAFE_INTEGER) {
      setError("Input value is out of supported integer range.");
      setResult(null);
      return;
    }

    // Convert decimalVal to all bases
    const binStr = decimalVal.toString(2);
    // Format binary in 4-bit nibbles for readability
    const formattedBin = binStr.replace(/\B(?=(\d{4})+(?!\d))/g, " ");

    const octStr = decimalVal.toString(8);
    const hexStr = decimalVal.toString(16).toUpperCase();
    const decStr = decimalVal.toString(10);

    setResult({
      bin: formattedBin,
      dec: decStr,
      oct: octStr,
      hex: hexStr,
      formula: "N = ∑ (digit × Baseⁱ)",
    });
  };

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Binary className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Number System Converter
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Instant radix conversions between Binary, Decimal, Octal, and Hexadecimal
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            Radix Base 2, 8, 10, 16
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Input Base & Value */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5 sm:col-span-1">
            <Label className="text-xs font-medium text-foreground">Input Radix / Base</Label>
            <select
              value={inputBase}
              onChange={(e) => {
                setInputBase(e.target.value as BaseType);
                setError(null);
              }}
              className="w-full h-9 px-2 text-xs bg-muted/40 border border-input rounded-md text-foreground focus:outline-hidden"
            >
              <option value="10">Decimal (Base 10)</option>
              <option value="2">Binary (Base 2)</option>
              <option value="8">Octal (Base 8)</option>
              <option value="16">Hexadecimal (Base 16)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-foreground">Enter Value</Label>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                inputBase === "2"
                  ? "e.g. 1011001"
                  : inputBase === "16"
                  ? "e.g. 1F4A"
                  : inputBase === "8"
                  ? "e.g. 754"
                  : "e.g. 255"
              }
              className="h-9 text-xs bg-muted/30 font-mono"
            />
          </div>
        </div>

        {/* Calculate Action */}
        <Button onClick={handleCalculate} className="w-full text-xs font-medium h-9">
          Convert
        </Button>

        {/* Error Indicator */}
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Final Converted Result Grid */}
        {result && !error && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Converted Output Bases
              </span>
              <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                Formula: {result.formula}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Decimal */}
              <div className="p-2.5 rounded-md bg-card border border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">
                    Decimal (Base 10)
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground">{result.dec}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(result.dec, "dec")}
                  className="text-muted-foreground hover:text-foreground p-1"
                  title="Copy"
                >
                  {copiedKey === "dec" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Hexadecimal */}
              <div className="p-2.5 rounded-md bg-card border border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">
                    Hexadecimal (Base 16)
                  </span>
                  <span className="text-sm font-bold font-mono text-primary">0x{result.hex}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`0x${result.hex}`, "hex")}
                  className="text-muted-foreground hover:text-foreground p-1"
                  title="Copy"
                >
                  {copiedKey === "hex" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Binary */}
              <div className="p-2.5 rounded-md bg-card border border-border/60 flex items-center justify-between sm:col-span-2">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">
                    Binary (Base 2)
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground break-all">{result.bin}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(result.bin.replace(/\s+/g, ""), "bin")}
                  className="text-muted-foreground hover:text-foreground p-1 shrink-0"
                  title="Copy"
                >
                  {copiedKey === "bin" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Octal */}
              <div className="p-2.5 rounded-md bg-card border border-border/60 flex items-center justify-between sm:col-span-2">
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">
                    Octal (Base 8)
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground">{result.oct}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(result.oct, "oct")}
                  className="text-muted-foreground hover:text-foreground p-1"
                  title="Copy"
                >
                  {copiedKey === "oct" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
