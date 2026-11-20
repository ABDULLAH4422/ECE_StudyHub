import React, { useState } from "react";
import { Cpu, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type GateType = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR";

interface GateInfo {
  name: string;
  expression: string;
  description: string;
  truthTable: { a: number; b?: number; out: number }[];
  compute: (a: number, b: number) => number;
}

const GATE_DATA: Record<GateType, GateInfo> = {
  AND: {
    name: "AND Gate",
    expression: "Y = A · B",
    description: "Output is HIGH (1) only if ALL inputs are HIGH (1).",
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 },
    ],
    compute: (a, b) => (a && b ? 1 : 0),
  },
  OR: {
    name: "OR Gate",
    expression: "Y = A + B",
    description: "Output is HIGH (1) if AT LEAST ONE input is HIGH (1).",
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 1 },
    ],
    compute: (a, b) => (a || b ? 1 : 0),
  },
  NOT: {
    name: "NOT Gate (Inverter)",
    expression: "Y = A'",
    description: "Inverts input logic: HIGH (1) becomes LOW (0), and vice versa.",
    truthTable: [
      { a: 0, out: 1 },
      { a: 1, out: 0 },
    ],
    compute: (a) => (a ? 0 : 1),
  },
  NAND: {
    name: "NAND Gate (Universal)",
    expression: "Y = (A · B)'",
    description: "AND followed by NOT. Output is LOW (0) only when all inputs are HIGH (1).",
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 },
    ],
    compute: (a, b) => (a && b ? 0 : 1),
  },
  NOR: {
    name: "NOR Gate (Universal)",
    expression: "Y = (A + B)'",
    description: "OR followed by NOT. Output is HIGH (1) only when all inputs are LOW (0).",
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 0 },
    ],
    compute: (a, b) => (a || b ? 0 : 1),
  },
  XOR: {
    name: "XOR Gate (Exclusive-OR)",
    expression: "Y = A ⊕ B = A'B + AB'",
    description: "Output is HIGH (1) when inputs are different (odd parity detector).",
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 },
    ],
    compute: (a, b) => (a !== b ? 1 : 0),
  },
  XNOR: {
    name: "XNOR Gate (Equivalence)",
    expression: "Y = (A ⊕ B)' = AB + A'B'",
    description: "Output is HIGH (1) when inputs are identical (even parity detector).",
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 },
    ],
    compute: (a, b) => (a === b ? 1 : 0),
  },
};

export function LogicGatesSimulator() {
  const [selectedGate, setSelectedGate] = useState<GateType>("AND");
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);

  const gate = GATE_DATA[selectedGate];
  const output = gate.compute(inputA, inputB);

  // SVG representation of gate shapes
  const renderGateSvg = () => {
    const isHighA = inputA === 1;
    const isHighB = inputB === 1;
    const isHighOut = output === 1;

    const strokeA = isHighA ? "#10b981" : "#94a3b8"; // Emerald for 1, slate for 0
    const strokeB = isHighB ? "#10b981" : "#94a3b8";
    const strokeOut = isHighOut ? "#10b981" : "#94a3b8";

    return (
      <svg
        viewBox="0 0 280 130"
        className="w-full max-w-[280px] h-32 mx-auto drop-shadow-xs"
        aria-label={`${gate.name} schematic diagram`}
      >
        {/* Input A Line */}
        <line x1="20" y1="40" x2="80" y2="40" stroke={strokeA} strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="40" r="5" fill={strokeA} />
        <text x="12" y="30" fontSize="11" fill="currentColor" fontFamily="monospace" fontWeight="bold">
          A={inputA}
        </text>

        {/* Input B Line (if not NOT gate) */}
        {selectedGate !== "NOT" && (
          <>
            <line x1="20" y1="90" x2="80" y2="90" stroke={strokeB} strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="90" r="5" fill={strokeB} />
            <text x="12" y="105" fontSize="11" fill="currentColor" fontFamily="monospace" fontWeight="bold">
              B={inputB}
            </text>
          </>
        )}

        {/* Gate Graphic Path */}
        {selectedGate === "AND" && (
          <path
            d="M 80 25 L 125 25 A 40 40 0 0 1 125 105 L 80 105 Z"
            fill="var(--card)"
            stroke="var(--foreground)"
            strokeWidth="2.5"
          />
        )}

        {selectedGate === "OR" && (
          <path
            d="M 75 25 Q 105 65 75 105 Q 130 105 160 65 Q 130 25 75 25 Z"
            fill="var(--card)"
            stroke="var(--foreground)"
            strokeWidth="2.5"
          />
        )}

        {selectedGate === "NOT" && (
          <>
            <polygon
              points="80,30 80,100 145,65"
              fill="var(--card)"
              stroke="var(--foreground)"
              strokeWidth="2.5"
            />
            <circle cx="151" cy="65" r="5" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2" />
          </>
        )}

        {selectedGate === "NAND" && (
          <>
            <path
              d="M 80 25 L 120 25 A 40 40 0 0 1 120 105 L 80 105 Z"
              fill="var(--card)"
              stroke="var(--foreground)"
              strokeWidth="2.5"
            />
            <circle cx="166" cy="65" r="5" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2" />
          </>
        )}

        {selectedGate === "NOR" && (
          <>
            <path
              d="M 75 25 Q 105 65 75 105 Q 130 105 155 65 Q 130 25 75 25 Z"
              fill="var(--card)"
              stroke="var(--foreground)"
              strokeWidth="2.5"
            />
            <circle cx="161" cy="65" r="5" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2" />
          </>
        )}

        {selectedGate === "XOR" && (
          <>
            <path d="M 68 25 Q 98 65 68 105" fill="none" stroke="var(--foreground)" strokeWidth="2.5" />
            <path
              d="M 78 25 Q 108 65 78 105 Q 135 105 165 65 Q 135 25 78 25 Z"
              fill="var(--card)"
              stroke="var(--foreground)"
              strokeWidth="2.5"
            />
          </>
        )}

        {selectedGate === "XNOR" && (
          <>
            <path d="M 68 25 Q 98 65 68 105" fill="none" stroke="var(--foreground)" strokeWidth="2.5" />
            <path
              d="M 78 25 Q 108 65 78 105 Q 132 105 157 65 Q 132 25 78 25 Z"
              fill="var(--card)"
              stroke="var(--foreground)"
              strokeWidth="2.5"
            />
            <circle cx="163" cy="65" r="5" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2" />
          </>
        )}

        {/* Output Line */}
        <line
          x1={
            selectedGate === "NOT"
              ? "156"
              : selectedGate === "NAND"
              ? "171"
              : selectedGate === "NOR" || selectedGate === "XNOR"
              ? "168"
              : selectedGate === "AND"
              ? "165"
              : "160"
          }
          y1="65"
          x2="240"
          y2="65"
          stroke={strokeOut}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="240" cy="65" r="6" fill={strokeOut} />
        <text x="248" y="70" fontSize="12" fill={strokeOut} fontFamily="monospace" fontWeight="bold">
          Y={output}
        </text>
      </svg>
    );
  };

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Logic Gates Simulator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Interactive digital logic gates with live state propagation and truth table
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
            {gate.expression}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Gate Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Select Logic Gate
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(GATE_DATA) as GateType[]).map((gt) => (
              <button
                key={gt}
                type="button"
                onClick={() => setSelectedGate(gt)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  selectedGate === gt
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground border border-border/60 hover:text-foreground"
                }`}
              >
                {gt}
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulation Playground Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Interactive Schematic Diagram & Controls (Left 7 cols) */}
          <div className="md:col-span-7 p-5 rounded-lg bg-muted/30 border border-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Circuit Schematic
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Signal: {output === 1 ? "HIGH (5V)" : "LOW (0V)"}
              </span>
            </div>

            {/* SVG Schematic */}
            <div className="py-2 flex items-center justify-center bg-card rounded-md border border-border/60">
              {renderGateSvg()}
            </div>

            {/* Interactive Switch Controls */}
            <div className="flex items-center justify-around gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-foreground">Input A:</span>
                <button
                  type="button"
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`w-14 h-8 rounded-md font-mono text-xs font-bold transition-all ${
                    inputA === 1
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {inputA === 1 ? "1 (HIGH)" : "0 (LOW)"}
                </button>
              </div>

              {selectedGate !== "NOT" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-foreground">Input B:</span>
                  <button
                    type="button"
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`w-14 h-8 rounded-md font-mono text-xs font-bold transition-all ${
                      inputB === 1
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {inputB === 1 ? "1 (HIGH)" : "0 (LOW)"}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-foreground">Output Y:</span>
                <span
                  className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                    output === 1
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {output}
                </span>
              </div>
            </div>
          </div>

          {/* Truth Table & Formula (Right 5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border/80 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Truth Table & Verification
              </span>

              <div className="border border-border/60 rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="text-[11px]">
                      <TableHead className="py-1.5 px-3 font-mono font-semibold">A</TableHead>
                      {selectedGate !== "NOT" && (
                        <TableHead className="py-1.5 px-3 font-mono font-semibold">B</TableHead>
                      )}
                      <TableHead className="py-1.5 px-3 font-mono font-semibold text-right">Output (Y)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gate.truthTable.map((row, idx) => {
                      const isActive =
                        selectedGate === "NOT"
                          ? row.a === inputA
                          : row.a === inputA && row.b === inputB;

                      return (
                        <TableRow
                          key={idx}
                          className={`text-xs font-mono transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <TableCell className="py-1.5 px-3">{row.a}</TableCell>
                          {selectedGate !== "NOT" && (
                            <TableCell className="py-1.5 px-3">{row.b}</TableCell>
                          )}
                          <TableCell className="py-1.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1">
                              {row.out}
                              {isActive && <Check className="w-3 h-3 text-primary inline" />}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Short Explanation */}
              <div className="pt-2 text-xs text-muted-foreground border-t border-border/60 leading-relaxed">
                <p className="font-medium text-foreground text-xs">{gate.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{gate.description}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
