import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { OhmsLawCalculator } from "@/components/calculators/OhmsLawCalculator";
import { ResistorColorCodeCalculator } from "@/components/calculators/ResistorColorCodeCalculator";
import { RCTimeConstantCalculator } from "@/components/calculators/RCTimeConstantCalculator";
import { NumberSystemConverter } from "@/components/calculators/NumberSystemConverter";
import { VoltageDividerCalculator } from "@/components/calculators/VoltageDividerCalculator";
import {
  Zap,
  SlidersHorizontal,
  Clock,
  Binary,
  GitCommit,
  Calculator,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calculators")({
  component: CalculatorsPage,
});

type CalculatorId = "ohms-law" | "resistor-color" | "rc-time" | "number-system" | "voltage-divider";

interface CalculatorItem {
  id: CalculatorId;
  name: string;
  shortDesc: string;
  formula: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CALCULATORS: CalculatorItem[] = [
  {
    id: "ohms-law",
    name: "Ohm's Law Calculator",
    shortDesc: "Voltage, current, resistance & electric power",
    formula: "V = I × R",
    icon: Zap,
  },
  {
    id: "resistor-color",
    name: "Resistor Color Code",
    shortDesc: "4-Band & 5-Band axial resistor values",
    formula: "R = Bands × Multiplier",
    icon: SlidersHorizontal,
  },
  {
    id: "rc-time",
    name: "RC Time Constant",
    shortDesc: "Time constant (τ), 5τ, and -3dB cutoff frequency",
    formula: "τ = R × C",
    icon: Clock,
  },
  {
    id: "number-system",
    name: "Number System Converter",
    shortDesc: "Binary, Decimal, Octal, and Hexadecimal",
    formula: "Radix: 2, 8, 10, 16",
    icon: Binary,
  },
  {
    id: "voltage-divider",
    name: "Voltage Divider",
    shortDesc: "Output voltage & division ratio across series resistors",
    formula: "Vout = Vin × [R₂/(R₁+R₂)]",
    icon: GitCommit,
  },
];

function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<CalculatorId>("ohms-law");

  return (
    <PublicLayout>
      <PageHeader
        category="Engineering Tools & Utilities"
        title="Academic Calculators"
        description="Interactive engineering computational tools for circuit design, laboratory analysis, and undergraduate sessional coursework."
        breadcrumbs={[{ label: "Academic Calculators" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Quick Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon;
            const isSelected = activeTab === calc.id;
            return (
              <button
                key={calc.id}
                type="button"
                onClick={() => setActiveTab(calc.id)}
                className={cn(
                  "p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between group",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card border-border/80 hover:bg-muted/50 text-foreground"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center font-bold",
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.5 rounded",
                      isSelected ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {calc.formula}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-xs truncate leading-snug">{calc.name}</h3>
                  <p
                    className={cn(
                      "text-[11px] line-clamp-1 mt-0.5",
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    {calc.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Calculator Component View */}
        <div className="max-w-3xl mx-auto">
          {activeTab === "ohms-law" && <OhmsLawCalculator />}
          {activeTab === "resistor-color" && <ResistorColorCodeCalculator />}
          {activeTab === "rc-time" && <RCTimeConstantCalculator />}
          {activeTab === "number-system" && <NumberSystemConverter />}
          {activeTab === "voltage-divider" && <VoltageDividerCalculator />}
        </div>
      </div>
    </PublicLayout>
  );
}
