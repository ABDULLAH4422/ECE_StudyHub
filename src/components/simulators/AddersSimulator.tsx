import React, { useState } from "react";
import { PlusCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AdderType = "HALF" | "FULL";

export function AddersSimulator() {
  const [adderType, setAdderType] = useState<AdderType>("HALF");
  const [bitA, setBitA] = useState<number>(1);
  const [bitB, setBitB] = useState<number>(1);
  const [cin, setCin] = useState<number>(0);

  // Computations
  // Half Adder:
  const haSum = bitA ^ bitB;
  const haCarry = bitA & bitB;

  // Full Adder:
  const faAxorB = bitA ^ bitB;
  const faSum = faAxorB ^ cin;
  const faCarry = (bitA & bitB) | (cin & faAxorB);

  const activeSum = adderType === "HALF" ? haSum : faSum;
  const activeCarry = adderType === "HALF" ? haCarry : faCarry;

  // Truth Tables
  const haTable = [
    { a: 0, b: 0, s: 0, c: 0 },
    { a: 0, b: 1, s: 1, c: 0 },
    { a: 1, b: 0, s: 1, c: 0 },
    { a: 1, b: 1, s: 0, c: 1 },
  ];

  const faTable = [
    { a: 0, b: 0, cin: 0, s: 0, c: 0 },
    { a: 0, b: 0, cin: 1, s: 1, c: 0 },
    { a: 0, b: 1, cin: 0, s: 1, c: 0 },
    { a: 0, b: 1, cin: 1, s: 0, c: 1 },
    { a: 1, b: 0, cin: 0, s: 1, c: 0 },
    { a: 1, b: 0, cin: 1, s: 0, c: 1 },
    { a: 1, b: 1, cin: 0, s: 0, c: 1 },
    { a: 1, b: 1, cin: 1, s: 1, c: 1 },
  ];

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Arithmetic Adders Simulator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Combinational binary adders with live gate propagation and truth tables
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
            {adderType === "HALF" ? "S = A ⊕ B, C = A·B" : "S = A ⊕ B ⊕ Cin"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Adder Model Toggle */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Select Circuit Architecture
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdderType("HALF")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                adderType === "HALF"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground border border-border/60 hover:text-foreground"
              }`}
            >
              Half Adder (2 Inputs)
            </button>
            <button
              type="button"
              onClick={() => setAdderType("FULL")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                adderType === "FULL"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground border border-border/60 hover:text-foreground"
              }`}
            >
              Full Adder (3 Inputs with Carry-In)
            </button>
          </div>
        </div>

        {/* Live Simulation Playground Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Schematic Diagram & Inputs (7 cols) */}
          <div className="md:col-span-7 p-5 rounded-lg bg-muted/30 border border-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Adder Gate Network
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Sum: {activeSum} · Carry: {activeCarry}
              </span>
            </div>

            {/* SVG Logic Diagram */}
            <div className="py-2 flex items-center justify-center bg-card rounded-md border border-border/60">
              {adderType === "HALF" ? (
                // Half Adder SVG (XOR for Sum, AND for Carry)
                <svg viewBox="0 0 320 160" className="w-full max-w-[320px] h-40" aria-label="Half Adder Schematic">
                  {/* Wire A */}
                  <line x1="20" y1="35" x2="100" y2="35" stroke={bitA ? "#10b981" : "#94a3b8"} strokeWidth="2.5" />
                  <circle cx="20" cy="35" r="4" fill={bitA ? "#10b981" : "#94a3b8"} />
                  <text x="12" y="25" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="currentColor">
                    A={bitA}
                  </text>

                  {/* Wire B */}
                  <line x1="20" y1="55" x2="100" y2="55" stroke={bitB ? "#10b981" : "#94a3b8"} strokeWidth="2.5" />
                  <circle cx="20" cy="55" r="4" fill={bitB ? "#10b981" : "#94a3b8"} />
                  <text x="12" y="70" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="currentColor">
                    B={bitB}
                  </text>

                  {/* Drop wires from A & B to AND gate */}
                  <line x1="60" y1="35" x2="60" y2="105" stroke={bitA ? "#10b981" : "#94a3b8"} strokeWidth="2.5" />
                  <circle cx="60" cy="35" r="3" fill={bitA ? "#10b981" : "#94a3b8"} />
                  <line x1="60" y1="105" x2="100" y2="105" stroke={bitA ? "#10b981" : "#94a3b8"} strokeWidth="2.5" />

                  <line x1="75" y1="55" x2="75" y2="125" stroke={bitB ? "#10b981" : "#94a3b8"} strokeWidth="2.5" />
                  <circle cx="75" cy="55" r="3" fill={bitB ? "#10b981" : "#94a3b8"} />
                  <line x1="75" y1="125" x2="100" y2="125" stroke={bitB ? "#10b981" : "#94a3b8"} strokeWidth="2.5" />

                  {/* XOR Gate (Top) */}
                  <g transform="translate(25, -15)">
                    <path d="M 75 40 Q 95 60 75 80" fill="none" stroke="var(--foreground)" strokeWidth="2" />
                    <path
                      d="M 82 40 Q 102 60 82 80 Q 120 80 140 60 Q 120 40 82 40 Z"
                      fill="var(--card)"
                      stroke="var(--foreground)"
                      strokeWidth="2"
                    />
                    <text x="100" y="63" fontSize="9" fontWeight="bold" fill="currentColor">XOR</text>
                  </g>

                  {/* AND Gate (Bottom) */}
                  <g transform="translate(25, 45)">
                    <path
                      d="M 75 55 L 110 55 A 25 25 0 0 1 110 85 L 75 85 Z"
                      fill="var(--card)"
                      stroke="var(--foreground)"
                      strokeWidth="2"
                    />
                    <text x="90" y="73" fontSize="9" fontWeight="bold" fill="currentColor">AND</text>
                  </g>

                  {/* Output Sum */}
                  <line x1="165" y1="45" x2="260" y2="45" stroke={haSum ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="260" cy="45" r="5" fill={haSum ? "#10b981" : "#94a3b8"} />
                  <text x="270" y="49" fontSize="12" fontWeight="bold" fontFamily="monospace" fill={haSum ? "#10b981" : "currentColor"}>
                    Sum={haSum}
                  </text>

                  {/* Output Carry */}
                  <line x1="160" y1="115" x2="260" y2="115" stroke={haCarry ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="260" cy="115" r="5" fill={haCarry ? "#10b981" : "#94a3b8"} />
                  <text x="270" y="119" fontSize="12" fontWeight="bold" fontFamily="monospace" fill={haCarry ? "#10b981" : "currentColor"}>
                    Carry={haCarry}
                  </text>
                </svg>
              ) : (
                // Full Adder Block Representation in SVG
                <svg viewBox="0 0 320 160" className="w-full max-w-[320px] h-40" aria-label="Full Adder Schematic">
                  {/* Central Block */}
                  <rect
                    x="100"
                    y="25"
                    width="120"
                    height="110"
                    rx="6"
                    fill="var(--card)"
                    stroke="var(--foreground)"
                    strokeWidth="2.5"
                  />
                  <text x="160" y="55" fontSize="13" fontWeight="bold" textAnchor="middle" fill="currentColor" fontFamily="monospace">
                    FULL ADDER
                  </text>
                  <text x="160" y="75" fontSize="10" textAnchor="middle" fill="var(--muted-foreground)" fontFamily="monospace">
                    2×HA + OR
                  </text>

                  {/* Inputs */}
                  <line x1="30" y1="45" x2="100" y2="45" stroke={bitA ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="30" cy="45" r="4" fill={bitA ? "#10b981" : "#94a3b8"} />
                  <text x="10" y="49" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                    A={bitA}
                  </text>

                  <line x1="30" y1="80" x2="100" y2="80" stroke={bitB ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="30" cy="80" r="4" fill={bitB ? "#10b981" : "#94a3b8"} />
                  <text x="10" y="84" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                    B={bitB}
                  </text>

                  <line x1="30" y1="115" x2="100" y2="115" stroke={cin ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="30" cy="115" r="4" fill={cin ? "#10b981" : "#94a3b8"} />
                  <text x="5" y="119" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                    Cin={cin}
                  </text>

                  {/* Outputs */}
                  <line x1="220" y1="55" x2="270" y2="55" stroke={faSum ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="270" cy="55" r="5" fill={faSum ? "#10b981" : "#94a3b8"} />
                  <text x="280" y="59" fontSize="12" fontWeight="bold" fontFamily="monospace" fill={faSum ? "#10b981" : "currentColor"}>
                    S={faSum}
                  </text>

                  <line x1="220" y1="105" x2="270" y2="105" stroke={faCarry ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                  <circle cx="270" cy="105" r="5" fill={faCarry ? "#10b981" : "#94a3b8"} />
                  <text x="280" y="109" fontSize="12" fontWeight="bold" fontFamily="monospace" fill={faCarry ? "#10b981" : "currentColor"}>
                    Cout={faCarry}
                  </text>
                </svg>
              )}
            </div>

            {/* Interactive Bit Toggle Switches */}
            <div className="flex flex-wrap items-center justify-around gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-medium">Input A:</span>
                <button
                  type="button"
                  onClick={() => setBitA(bitA === 1 ? 0 : 1)}
                  className={`w-10 h-7 rounded text-xs font-mono font-bold transition-all ${
                    bitA === 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border"
                  }`}
                >
                  {bitA}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-medium">Input B:</span>
                <button
                  type="button"
                  onClick={() => setBitB(bitB === 1 ? 0 : 1)}
                  className={`w-10 h-7 rounded text-xs font-mono font-bold transition-all ${
                    bitB === 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border"
                  }`}
                >
                  {bitB}
                </button>
              </div>

              {adderType === "FULL" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-medium">Carry In:</span>
                  <button
                    type="button"
                    onClick={() => setCin(cin === 1 ? 0 : 1)}
                    className={`w-10 h-7 rounded text-xs font-mono font-bold transition-all ${
                      cin === 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border"
                    }`}
                  >
                    {cin}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-foreground">Output:</span>
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-muted border border-border">
                  S={activeSum}, C={activeCarry}
                </span>
              </div>
            </div>
          </div>

          {/* Truth Table & Equations (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border/80 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                {adderType === "HALF" ? "Half Adder Truth Table" : "Full Adder Truth Table"}
              </span>

              <div className="border border-border/60 rounded-md overflow-hidden max-h-56 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/40 sticky top-0">
                    <TableRow className="text-[11px]">
                      <TableHead className="py-1.5 px-2.5 font-mono font-semibold">A</TableHead>
                      <TableHead className="py-1.5 px-2.5 font-mono font-semibold">B</TableHead>
                      {adderType === "FULL" && (
                        <TableHead className="py-1.5 px-2.5 font-mono font-semibold">Cin</TableHead>
                      )}
                      <TableHead className="py-1.5 px-2.5 font-mono font-semibold">Sum</TableHead>
                      <TableHead className="py-1.5 px-2.5 font-mono font-semibold text-right">Carry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adderType === "HALF"
                      ? haTable.map((row, idx) => {
                          const isActive = row.a === bitA && row.b === bitB;
                          return (
                            <TableRow
                              key={idx}
                              className={`text-xs font-mono transition-colors ${
                                isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted/30"
                              }`}
                            >
                              <TableCell className="py-1 px-2.5">{row.a}</TableCell>
                              <TableCell className="py-1 px-2.5">{row.b}</TableCell>
                              <TableCell className="py-1 px-2.5">{row.s}</TableCell>
                              <TableCell className="py-1 px-2.5 text-right">
                                {row.c}
                                {isActive && <Check className="w-3 h-3 text-primary inline ml-1" />}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : faTable.map((row, idx) => {
                          const isActive = row.a === bitA && row.b === bitB && row.cin === cin;
                          return (
                            <TableRow
                              key={idx}
                              className={`text-xs font-mono transition-colors ${
                                isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted/30"
                              }`}
                            >
                              <TableCell className="py-1 px-2.5">{row.a}</TableCell>
                              <TableCell className="py-1 px-2.5">{row.b}</TableCell>
                              <TableCell className="py-1 px-2.5">{row.cin}</TableCell>
                              <TableCell className="py-1 px-2.5">{row.s}</TableCell>
                              <TableCell className="py-1 px-2.5 text-right">
                                {row.c}
                                {isActive && <Check className="w-3 h-3 text-primary inline ml-1" />}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>

              {/* Boolean Algebra */}
              <div className="pt-2 text-xs text-muted-foreground border-t border-border/60 space-y-1">
                <p className="font-semibold text-foreground text-xs">
                  {adderType === "HALF" ? "Half Adder Formulas:" : "Full Adder Formulas:"}
                </p>
                <div className="font-mono text-[11px] text-primary space-y-0.5">
                  <p>Sum = {adderType === "HALF" ? "A ⊕ B" : "A ⊕ B ⊕ Cin"}</p>
                  <p>
                    Carry = {adderType === "HALF" ? "A · B" : "(A · B) + (Cin · (A ⊕ B))"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
