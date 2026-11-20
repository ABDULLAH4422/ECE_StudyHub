import React, { useState, useEffect } from "react";
import { Hash, Play, Pause, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CounterBitWidth = 3 | 4;
type CountDirection = "UP" | "DOWN";

export function DigitalCountersSimulator() {
  const [bitWidth, setBitWidth] = useState<CounterBitWidth>(4);
  const [direction, setDirection] = useState<CountDirection>("UP");
  const [count, setCount] = useState<number>(0);
  const [autoClock, setAutoClock] = useState<boolean>(false);
  const [clockSpeed, setClockSpeed] = useState<number>(1000); // 1000ms = 1Hz, 500ms = 2Hz
  const [pulseActive, setPulseActive] = useState<boolean>(false);

  const maxCount = bitWidth === 3 ? 7 : 15;
  const modulus = bitWidth === 3 ? 8 : 16;

  // Clock Pulse Step Function
  const handleClockPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 200);

    setCount((prev) => {
      if (direction === "UP") {
        return prev >= maxCount ? 0 : prev + 1;
      } else {
        return prev <= 0 ? maxCount : prev - 1;
      }
    });
  };

  // Auto-Clock effect
  useEffect(() => {
    if (!autoClock) return;
    const interval = setInterval(() => {
      handleClockPulse();
    }, clockSpeed);
    return () => clearInterval(interval);
  }, [autoClock, clockSpeed, direction, maxCount]);

  // Handle bit-width change
  const handleBitWidthChange = (width: CounterBitWidth) => {
    setBitWidth(width);
    if (count > (width === 3 ? 7 : 15)) {
      setCount(0);
    }
  };

  const handleReset = () => {
    setCount(0);
    setAutoClock(false);
  };

  // Convert current count to binary string padded to bitWidth
  const binString = count.toString(2).padStart(bitWidth, "0");
  const bits = binString.split("").map((b) => parseInt(b));

  // Next count calculation for display
  const nextCount =
    direction === "UP"
      ? count >= maxCount ? 0 : count + 1
      : count <= 0 ? maxCount : count - 1;

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Synchronous / Asynchronous Digital Counter
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Multi-bit binary ripple counter simulation with live bit states and timing progression
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
            MOD-{modulus} ({bitWidth}-Bit {direction})
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Controls Bar: Bit-Width, Direction, and Clocking */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Bit-Width Selector */}
            <div className="flex gap-1 p-0.5 rounded-md bg-muted/50 border border-border/60">
              <button
                type="button"
                onClick={() => handleBitWidthChange(3)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  bitWidth === 3
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                3-Bit (0–7)
              </button>
              <button
                type="button"
                onClick={() => handleBitWidthChange(4)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  bitWidth === 4
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                4-Bit (0–15)
              </button>
            </div>

            {/* Direction Selector */}
            <div className="flex gap-1 p-0.5 rounded-md bg-muted/50 border border-border/60">
              <button
                type="button"
                onClick={() => setDirection("UP")}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  direction === "UP"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ArrowUp className="w-3 h-3 text-emerald-500" />
                Count UP
              </button>
              <button
                type="button"
                onClick={() => setDirection("DOWN")}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  direction === "DOWN"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ArrowDown className="w-3 h-3 text-amber-500" />
                Count DOWN
              </button>
            </div>
          </div>

          {/* Clock Generator Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoClock(!autoClock)}
              className="h-8 text-xs gap-1.5"
            >
              {autoClock ? <Pause className="w-3.5 h-3.5 text-destructive" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              {autoClock ? "Pause Auto Clock" : "Auto Clock (1Hz)"}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleClockPulse}
              className={`h-8 text-xs font-medium ${
                pulseActive ? "bg-amber-600 text-white" : ""
              }`}
            >
              Manual Clock Pulse ↑
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-8 text-xs text-muted-foreground"
              title="Reset counter to zero"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Live Simulation Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Visual Display (7 cols) */}
          <div className="md:col-span-7 p-5 rounded-lg bg-muted/30 border border-border/70 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${pulseActive ? "bg-amber-500 scale-125" : "bg-emerald-500"} transition-all`} />
                Digital Register Display
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Next State: {nextCount} (0b{nextCount.toString(2).padStart(bitWidth, "0")})
              </span>
            </div>

            {/* Large 7-Segment / Digital Style Display */}
            <div className="p-5 rounded-lg bg-card border border-border/80 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-baseline gap-4">
                <div className="text-center">
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">Decimal</span>
                  <span className="text-5xl font-mono font-bold tracking-tight text-foreground">
                    {count}
                  </span>
                </div>
                <div className="text-center border-l border-border pl-4">
                  <span className="text-[10px] text-muted-foreground font-mono block uppercase">Hex</span>
                  <span className="text-3xl font-mono font-bold text-primary">
                    0x{count.toString(16).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Glowing Bit LEDs */}
              <div className="flex items-center justify-center gap-3 pt-2">
                {bits.map((bitVal, idx) => {
                  const bitIndex = bitWidth - 1 - idx; // Q3, Q2, Q1, Q0
                  const isHigh = bitVal === 1;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-150 ${
                          isHigh
                            ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20"
                            : "bg-muted/80 text-muted-foreground border-border/80"
                        }`}
                      >
                        {bitVal}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Q{bitIndex} {bitIndex === 0 ? "(LSB)" : bitIndex === bitWidth - 1 ? "(MSB)" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ripple Counter Block Diagram SVG */}
            <div className="p-3 rounded-md bg-card border border-border/60">
              <span className="text-[10px] font-mono text-muted-foreground block mb-2 uppercase">
                Cascaded Toggle Flip-Flop Architecture
              </span>
              <svg viewBox="0 0 320 80" className="w-full h-20" aria-label="Counter Schematic">
                {Array.from({ length: bitWidth }).map((_, i) => {
                  const x = 20 + i * (280 / bitWidth);
                  const bitVal = bits[bitWidth - 1 - i];
                  const isHigh = bitVal === 1;

                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y="15"
                        width={280 / bitWidth - 12}
                        height="50"
                        rx="4"
                        fill="var(--muted)"
                        stroke="var(--border)"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x + (280 / bitWidth - 12) / 2}
                        y="32"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill="var(--foreground)"
                      >
                        FF-{i}
                      </text>
                      <circle
                        cx={x + (280 / bitWidth - 12) / 2}
                        cy="48"
                        r="6"
                        fill={isHigh ? "#10b981" : "#94a3b8"}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Sequence State Table & Formulas (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border/80 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Counting State Sequence
              </span>

              <div className="border border-border/60 rounded-md overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-muted/40 sticky top-0 text-[11px] text-muted-foreground">
                    <tr>
                      <th className="py-1.5 px-3 font-semibold">Dec</th>
                      <th className="py-1.5 px-3 font-semibold">Binary Output</th>
                      <th className="py-1.5 px-3 font-semibold text-right">Hex</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: modulus }).map((_, num) => {
                      const isActive = num === count;
                      const binRep = num.toString(2).padStart(bitWidth, "0");

                      return (
                        <tr
                          key={num}
                          className={`border-b border-border/40 transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          <td className="py-1 px-3">{num}</td>
                          <td className="py-1 px-3 tracking-widest">{binRep}</td>
                          <td className="py-1 px-3 text-right">0x{num.toString(16).toUpperCase()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Theory Summary */}
              <div className="pt-2 text-xs text-muted-foreground border-t border-border/60 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-foreground text-xs">
                  Modulus & Frequency Division:
                </p>
                <div className="font-mono text-[11px] text-primary space-y-0.5">
                  <p>Modulus M = 2ⁿ = 2^{bitWidth} = {modulus} states</p>
                  <p>f_out(MSB) = f_clk / {modulus}</p>
                </div>
                <p className="text-[11px]">
                  Each cascaded flip-flop divides input clock frequency by 2. Q₀ operates at f/2, Q₁ at f/4, up to MSB at f/{modulus}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
