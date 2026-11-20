import React, { useState, useEffect } from "react";
import { Activity, Play, Pause, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type RCMode = "CHARGING" | "DISCHARGING";

export function RCCircuitSimulator() {
  const [mode, setMode] = useState<RCMode>("CHARGING");
  const [vs, setVs] = useState<number>(10); // Source Voltage (V)
  const [rKilo, setRKilo] = useState<number>(10); // Resistance in kΩ
  const [cMicro, setCMicro] = useState<number>(100); // Capacitance in µF

  const [simTime, setSimTime] = useState<number>(0); // Current simulated time in seconds
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Time Constant: τ = R × C
  // R in Ohms = rKilo * 1000
  // C in Farads = cMicro * 1e-6
  // τ = (rKilo * 1000) * (cMicro * 1e-6) = (rKilo * cMicro) / 1000
  const tau = (rKilo * cMicro) / 1000;
  const maxTime = Math.max(tau * 5, 0.001); // 5 tau covers 99.3%

  // Current capacitor voltage Vc(t)
  const vc =
    mode === "CHARGING"
      ? vs * (1 - Math.exp(-simTime / tau))
      : vs * Math.exp(-simTime / tau);

  // Current through circuit i(t) = (Vs / R) * exp(-t / tau)
  const currentMA = ((vs / (rKilo * 1000)) * Math.exp(-simTime / tau)) * 1000;

  // Animation playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimTime((prev) => {
        const step = maxTime / 120;
        if (prev + step >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prev + step;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, maxTime]);

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };

  // Generate SVG path points for the voltage curve
  const svgWidth = 320;
  const svgHeight = 160;
  const padding = 30;

  const graphWidth = svgWidth - padding * 2;
  const graphHeight = svgHeight - padding * 2;

  const pointsCount = 60;
  const pathD = Array.from({ length: pointsCount + 1 }).map((_, i) => {
    const t = (i / pointsCount) * maxTime;
    const v =
      mode === "CHARGING"
        ? vs * (1 - Math.exp(-t / tau))
        : vs * Math.exp(-t / tau);

    const x = padding + (t / maxTime) * graphWidth;
    const y = svgHeight - padding - (v / (vs || 1)) * graphHeight;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  // Marker for current simulation time
  const currentX = padding + (Math.min(simTime, maxTime) / maxTime) * graphWidth;
  const currentY = svgHeight - padding - (vc / (vs || 1)) * graphHeight;

  // Marker for 1 Tau
  const tauX = padding + (tau / maxTime) * graphWidth;

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardHeader className="p-5 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                RC Transient Circuit Simulator
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Charging & discharging voltage transient dynamics with live interactive curve
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
            {mode === "CHARGING" ? "Vc(t) = Vs(1 - e⁻ᵗ/ᴿᶜ)" : "Vc(t) = V₀·e⁻ᵗ/ᴿᶜ"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Mode Selector & Playback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 p-0.5 rounded-md bg-muted/50 border border-border/60">
            <button
              type="button"
              onClick={() => {
                setMode("CHARGING");
                setSimTime(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === "CHARGING"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Charging Mode
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("DISCHARGING");
                setSimTime(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                mode === "DISCHARGING"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Discharging Mode
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 text-xs gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-destructive" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              {isPlaying ? "Pause" : "Simulate"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-8 text-xs text-muted-foreground"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Reset t=0
            </Button>
          </div>
        </div>

        {/* Live Simulation Graph & Circuit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Live Transient Voltage Graph (7 cols) */}
          <div className="md:col-span-7 p-4 rounded-lg bg-card border border-border/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-foreground">
                Vc(t) Voltage Curve vs Time
              </span>
              <span className="text-primary font-bold">
                t = {simTime.toFixed(3)} s ({((simTime / tau) || 0).toFixed(2)} τ)
              </span>
            </div>

            {/* SVG Graph Canvas */}
            <div className="p-2 rounded-md bg-muted/30 border border-border/60 flex justify-center">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[340px] h-48 select-none">
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="var(--border)" strokeWidth="1" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="var(--border)" strokeWidth="1" />

                {/* 1 Tau Vertical Dashed Line */}
                <line
                  x1={tauX}
                  y1={padding}
                  x2={tauX}
                  y2={svgHeight - padding}
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text x={tauX - 8} y={svgHeight - 12} fontSize="9" fontFamily="monospace" fill="var(--muted-foreground)">
                  1τ
                </text>

                {/* 5 Tau Label */}
                <text x={svgWidth - padding - 15} y={svgHeight - 12} fontSize="9" fontFamily="monospace" fill="var(--muted-foreground)">
                  5τ
                </text>

                {/* Voltage Y Axis Labels */}
                <text x="6" y={padding + 5} fontSize="9" fontFamily="monospace" fill="var(--muted-foreground)">
                  {vs}V
                </text>
                <text x="6" y={svgHeight - padding} fontSize="9" fontFamily="monospace" fill="var(--muted-foreground)">
                  0V
                </text>

                {/* Theoretical Curve Path */}
                <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" />

                {/* Current Active Marker on Curve */}
                <circle cx={currentX} cy={currentY} r="5" fill="var(--accent)" stroke="var(--card)" strokeWidth="2" />
                <line
                  x1={currentX}
                  y1={currentY}
                  x2={currentX}
                  y2={svgHeight - padding}
                  stroke="var(--accent)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>
            </div>

            {/* Time Slider Control */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>0s (Initial)</span>
                <span>Adjust Time Slider</span>
                <span>{maxTime.toFixed(3)}s (5τ)</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxTime}
                step={maxTime / 200}
                value={simTime}
                onChange={(e) => {
                  setIsPlaying(false);
                  setSimTime(parseFloat(e.target.value));
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Circuit Parameters & Instantaneous Values (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            {/* Instantaneous Values Card */}
            <div className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Instantaneous State
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-md bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground font-mono block">Capacitor Vc</span>
                  <span className="text-base font-bold font-mono text-foreground">
                    {vc.toFixed(3)} V
                  </span>
                  <span className="text-[10px] text-primary font-mono block mt-0.5">
                    {((vc / (vs || 1)) * 100).toFixed(1)}% of Vs
                  </span>
                </div>

                <div className="p-2.5 rounded-md bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground font-mono block">Circuit Current</span>
                  <span className="text-base font-bold font-mono text-foreground">
                    {currentMA.toFixed(3)} mA
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                    i(t) = i₀·e⁻ᵗ/ᴿᶜ
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-card border border-border/60 flex items-center justify-between font-mono text-xs">
                <span className="text-muted-foreground">Time Constant (τ = R·C):</span>
                <span className="font-bold text-foreground">{tau.toFixed(4)} s</span>
              </div>
            </div>

            {/* Adjustable Circuit Parameters */}
            <div className="p-4 rounded-lg bg-card border border-border/80 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                Component Parameters
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] font-mono text-muted-foreground">Vs (V)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={vs}
                    onChange={(e) => setVs(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="h-8 text-xs font-mono bg-muted/30"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-mono text-muted-foreground">R (kΩ)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={rKilo}
                    onChange={(e) => setRKilo(Math.max(0.1, parseFloat(e.target.value) || 1))}
                    className="h-8 text-xs font-mono bg-muted/30"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-mono text-muted-foreground">C (µF)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={cMicro}
                    onChange={(e) => setCMicro(Math.max(0.1, parseFloat(e.target.value) || 1))}
                    className="h-8 text-xs font-mono bg-muted/30"
                  />
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                <p>
                  At $t = 1\tau$, capacitor charges to <strong>63.2%</strong> of $V_s$ (or drops to <strong>36.8%</strong>). At $t = 5\tau$, transient is <strong>99.3%</strong> complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
