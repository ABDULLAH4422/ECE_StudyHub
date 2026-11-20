import React, { useState, useEffect } from "react";
import { GitBranch, Play, Pause, RefreshCw, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type FlipFlopType = "SR" | "JK" | "D" | "T";

interface FFInfo {
  name: string;
  equation: string;
  description: string;
  tableHeaders: string[];
  tableRows: { inputs: number[]; nextQ: string; stateName: string }[];
}

const FF_CONFIG: Record<FlipFlopType, FFInfo> = {
  SR: {
    name: "SR (Set-Reset) Flip-Flop",
    equation: "Q(next) = S + R'Q (for S·R = 0)",
    description: "Sets Q=1 when S=1, Resets Q=0 when R=1. S=1 and R=1 is an invalid/indeterminate state.",
    tableHeaders: ["S", "R", "Q(next)", "Function"],
    tableRows: [
      { inputs: [0, 0], nextQ: "Q", stateName: "Hold (No Change)" },
      { inputs: [0, 1], nextQ: "0", stateName: "Reset" },
      { inputs: [1, 0], nextQ: "1", stateName: "Set" },
      { inputs: [1, 1], nextQ: "Invalid", stateName: "Forbidden / Race" },
    ],
  },
  JK: {
    name: "JK Flip-Flop (Universal)",
    equation: "Q(next) = J·Q' + K'·Q",
    description: "Refines the SR latch: J acts like S, K acts like R, and J=1, K=1 toggles the output state.",
    tableHeaders: ["J", "K", "Q(next)", "Function"],
    tableRows: [
      { inputs: [0, 0], nextQ: "Q", stateName: "Hold (No Change)" },
      { inputs: [0, 1], nextQ: "0", stateName: "Reset" },
      { inputs: [1, 0], nextQ: "1", stateName: "Set" },
      { inputs: [1, 1], nextQ: "Q'", stateName: "Toggle" },
    ],
  },
  D: {
    name: "D (Data / Delay) Flip-Flop",
    equation: "Q(next) = D",
    description: "Transfers input D to output Q on every clock edge. Essential for registers and memory.",
    tableHeaders: ["D", "Q(next)", "Function"],
    tableRows: [
      { inputs: [0], nextQ: "0", stateName: "Reset to 0" },
      { inputs: [1], nextQ: "1", stateName: "Set to 1" },
    ],
  },
  T: {
    name: "T (Toggle) Flip-Flop",
    equation: "Q(next) = T ⊕ Q",
    description: "Toggles output Q when T=1; holds current state when T=0. Used in frequency division.",
    tableHeaders: ["T", "Q(next)", "Function"],
    tableRows: [
      { inputs: [0], nextQ: "Q", stateName: "Hold (No Change)" },
      { inputs: [1], nextQ: "Q'", stateName: "Toggle (Invert)" },
    ],
  },
};

export function FlipFlopsSimulator() {
  const [selectedFF, setSelectedFF] = useState<FlipFlopType>("SR");
  const [in1, setIn1] = useState<number>(1); // S, J, D, T
  const [in2, setIn2] = useState<number>(0); // R, K
  const [q, setQ] = useState<number>(0);
  const [isInvalidState, setIsInvalidState] = useState<boolean>(false);
  const [clockPulse, setClockPulse] = useState<boolean>(false);
  const [autoClock, setAutoClock] = useState<boolean>(false);

  const ff = FF_CONFIG[selectedFF];

  // Clock trigger function: updates state on clock edge
  const triggerClockEdge = () => {
    setClockPulse(true);
    setTimeout(() => setClockPulse(false), 200);

    if (selectedFF === "SR") {
      if (in1 === 0 && in2 === 0) {
        // Hold
        setIsInvalidState(false);
      } else if (in1 === 0 && in2 === 1) {
        // Reset
        setQ(0);
        setIsInvalidState(false);
      } else if (in1 === 1 && in2 === 0) {
        // Set
        setQ(1);
        setIsInvalidState(false);
      } else if (in1 === 1 && in2 === 1) {
        // Invalid
        setIsInvalidState(true);
      }
    } else if (selectedFF === "JK") {
      setIsInvalidState(false);
      if (in1 === 0 && in2 === 0) {
        // Hold
      } else if (in1 === 0 && in2 === 1) {
        setQ(0); // Reset
      } else if (in1 === 1 && in2 === 0) {
        setQ(1); // Set
      } else if (in1 === 1 && in2 === 1) {
        setQ((prev) => (prev === 1 ? 0 : 1)); // Toggle
      }
    } else if (selectedFF === "D") {
      setIsInvalidState(false);
      setQ(in1);
    } else if (selectedFF === "T") {
      setIsInvalidState(false);
      if (in1 === 1) {
        setQ((prev) => (prev === 1 ? 0 : 1));
      }
    }
  };

  // Auto-clock effect
  useEffect(() => {
    if (!autoClock) return;
    const interval = setInterval(() => {
      triggerClockEdge();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClock, in1, in2, selectedFF, q]);

  // Reset function
  const handleReset = () => {
    setQ(0);
    setIsInvalidState(false);
    setAutoClock(false);
  };

  const qBar = isInvalidState ? 0 : q === 1 ? 0 : 1;

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Sequential Logic Flip-Flop Simulator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Simulate bistable multivibrators with clock edges and characteristic tables
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
            {ff.equation}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Flip-Flop Type Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Select Flip-Flop Model
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FF_CONFIG) as FlipFlopType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setSelectedFF(type);
                  setIsInvalidState(false);
                  setIn1(1);
                  setIn2(0);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  selectedFF === type
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground border border-border/60 hover:text-foreground"
                }`}
              >
                {type} Flip-Flop
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulator View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Schematic & Clock Controls (7 cols) */}
          <div className="md:col-span-7 p-5 rounded-lg bg-muted/30 border border-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${clockPulse ? "bg-amber-500 scale-125" : "bg-emerald-500"} transition-all`} />
                Circuit Block Diagram
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAutoClock(!autoClock)}
                  className="h-7 text-[11px] gap-1"
                >
                  {autoClock ? <Pause className="w-3 h-3 text-destructive" /> : <Play className="w-3 h-3 text-emerald-600" />}
                  {autoClock ? "Pause Clock" : "Auto Clock (1Hz)"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Reset outputs"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* SVG Flip-Flop Block */}
            <div className="py-2 flex items-center justify-center bg-card rounded-md border border-border/60">
              <svg viewBox="0 0 320 140" className="w-full max-w-[320px] h-36" aria-label="Flip-Flop Schematic">
                {/* Main Integrated IC Block */}
                <rect
                  x="100"
                  y="20"
                  width="120"
                  height="100"
                  rx="6"
                  fill="var(--card)"
                  stroke="var(--foreground)"
                  strokeWidth="2.5"
                />
                <text
                  x="160"
                  y="42"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="currentColor"
                  fontFamily="monospace"
                >
                  {selectedFF}-FF
                </text>

                {/* Clock Triangle Indicator */}
                <path d="M 100 65 L 115 70 L 100 75 Z" fill="none" stroke="var(--foreground)" strokeWidth="2" />
                <line x1="40" y1="70" x2="100" y2="70" stroke={clockPulse ? "#f59e0b" : "#94a3b8"} strokeWidth="3" />
                <circle cx="40" cy="70" r="4" fill={clockPulse ? "#f59e0b" : "#94a3b8"} />
                <text x="15" y="74" fontSize="10" fontFamily="monospace" fill={clockPulse ? "#f59e0b" : "currentColor"}>
                  CLK
                </text>

                {/* Input 1 Line */}
                <line x1="40" y1="38" x2="100" y2="38" stroke={in1 === 1 ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                <circle cx="40" cy="38" r="4" fill={in1 === 1 ? "#10b981" : "#94a3b8"} />
                <text x="25" y="42" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                  {selectedFF === "D" ? "D" : selectedFF === "T" ? "T" : selectedFF === "SR" ? "S" : "J"}
                </text>

                {/* Input 2 Line (SR / JK) */}
                {(selectedFF === "SR" || selectedFF === "JK") && (
                  <>
                    <line x1="40" y1="102" x2="100" y2="102" stroke={in2 === 1 ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                    <circle cx="40" cy="102" r="4" fill={in2 === 1 ? "#10b981" : "#94a3b8"} />
                    <text x="25" y="106" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                      {selectedFF === "SR" ? "R" : "K"}
                    </text>
                  </>
                )}

                {/* Output Q Line */}
                <line x1="220" y1="42" x2="280" y2="42" stroke={q === 1 ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                <circle cx="280" cy="42" r="5" fill={q === 1 ? "#10b981" : "#94a3b8"} />
                <text x="290" y="46" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                  Q={isInvalidState ? "?" : q}
                </text>

                {/* Output Q-Bar Line */}
                <line x1="220" y1="98" x2="280" y2="98" stroke={qBar === 1 ? "#10b981" : "#94a3b8"} strokeWidth="3" />
                <circle cx="280" cy="98" r="5" fill={qBar === 1 ? "#10b981" : "#94a3b8"} />
                <text x="290" y="102" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">
                  Q'={isInvalidState ? "?" : qBar}
                </text>
              </svg>
            </div>

            {/* Inputs & Clock Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium">
                  {selectedFF === "D" ? "Input D:" : selectedFF === "T" ? "Input T:" : selectedFF === "SR" ? "Input S:" : "Input J:"}
                </span>
                <button
                  type="button"
                  onClick={() => setIn1(in1 === 1 ? 0 : 1)}
                  className={`w-12 h-7 rounded text-xs font-mono font-bold transition-all ${
                    in1 === 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border"
                  }`}
                >
                  {in1}
                </button>
              </div>

              {(selectedFF === "SR" || selectedFF === "JK") && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium">
                    {selectedFF === "SR" ? "Input R:" : "Input K:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIn2(in2 === 1 ? 0 : 1)}
                    className={`w-12 h-7 rounded text-xs font-mono font-bold transition-all ${
                      in2 === 1 ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground border"
                    }`}
                  >
                    {in2}
                  </button>
                </div>
              )}

              {/* Trigger Clock Pulse Button */}
              <Button
                onClick={triggerClockEdge}
                size="sm"
                className={`h-8 text-xs font-medium gap-1.5 ${
                  clockPulse ? "bg-amber-600 text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                Trigger Clock Edge ↑
              </Button>
            </div>

            {/* Invalid State Alert (For SR Flip-Flop) */}
            {isInvalidState && (
              <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Forbidden State (S=1, R=1):</strong> In physical hardware, both outputs attempt to go LOW, causing race condition and instability.
                </span>
              </div>
            )}
          </div>

          {/* Characteristic Table (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border/80 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Characteristic State Table
              </span>

              <div className="border border-border/60 rounded-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="text-[11px]">
                      {ff.tableHeaders.map((hdr, i) => (
                        <TableHead key={i} className="py-1.5 px-3 font-mono font-semibold">
                          {hdr}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ff.tableRows.map((row, idx) => {
                      const isActive =
                        selectedFF === "D" || selectedFF === "T"
                          ? row.inputs[0] === in1
                          : row.inputs[0] === in1 && row.inputs[1] === in2;

                      return (
                        <TableRow
                          key={idx}
                          className={`text-xs font-mono transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          {row.inputs.map((val, vi) => (
                            <TableCell key={vi} className="py-1.5 px-3">
                              {val}
                            </TableCell>
                          ))}
                          <TableCell className="py-1.5 px-3">{row.nextQ}</TableCell>
                          <TableCell className="py-1.5 px-3 text-right text-[11px]">
                            {row.stateName}
                            {isActive && <Check className="w-3 h-3 text-primary inline ml-1" />}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Description */}
              <div className="pt-2 text-xs text-muted-foreground border-t border-border/60 leading-relaxed">
                <p className="font-medium text-foreground text-xs">{ff.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{ff.description}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
