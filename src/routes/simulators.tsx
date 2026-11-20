import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { LogicGatesSimulator } from "@/components/simulators/LogicGatesSimulator";
import { FlipFlopsSimulator } from "@/components/simulators/FlipFlopsSimulator";
import { AddersSimulator } from "@/components/simulators/AddersSimulator";
import { RCCircuitSimulator } from "@/components/simulators/RCCircuitSimulator";
import { DigitalCountersSimulator } from "@/components/simulators/DigitalCountersSimulator";
import {
  Cpu,
  GitBranch,
  PlusCircle,
  Activity,
  Hash,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulators")({
  component: SimulatorsPage,
});

type SimulatorId = "logic-gates" | "flip-flops" | "adders" | "rc-circuit" | "counters";

interface SimulatorItem {
  id: SimulatorId;
  name: string;
  shortDesc: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIMULATORS: SimulatorItem[] = [
  {
    id: "logic-gates",
    name: "Logic Gates",
    shortDesc: "AND, OR, NOT, NAND, NOR, XOR, XNOR with live truth table",
    tag: "Combinational",
    icon: Cpu,
  },
  {
    id: "flip-flops",
    name: "Flip-Flops",
    shortDesc: "SR, JK, D, T flip-flops with clock edges & state tables",
    tag: "Sequential",
    icon: GitBranch,
  },
  {
    id: "adders",
    name: "Binary Adders",
    shortDesc: "Half Adder and Full Adder gate logic & bit propagation",
    tag: "Arithmetic",
    icon: PlusCircle,
  },
  {
    id: "rc-circuit",
    name: "RC Circuit Transient",
    shortDesc: "Charging and discharging dynamics with live voltage curves",
    tag: "Analog / Transient",
    icon: Activity,
  },
  {
    id: "counters",
    name: "Digital Counters",
    shortDesc: "3-Bit & 4-Bit synchronous/asynchronous up/down counters",
    tag: "Registers",
    icon: Hash,
  },
];

function SimulatorsPage() {
  const [activeTab, setActiveTab] = useState<SimulatorId>("logic-gates");

  return (
    <PublicLayout>
      <PageHeader
        category="Interactive Laboratory"
        title="Academic Simulators"
        description="Interactive digital logic, sequential circuit, and transient circuit simulators designed for ECE laboratory experiments, waveform inspection, and conceptual verification."
        breadcrumbs={[{ label: "Academic Simulators" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Quick Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SIMULATORS.map((sim) => {
            const Icon = sim.icon;
            const isSelected = activeTab === sim.id;
            return (
              <button
                key={sim.id}
                type="button"
                onClick={() => setActiveTab(sim.id)}
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
                    {sim.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-xs truncate leading-snug">{sim.name}</h3>
                  <p
                    className={cn(
                      "text-[11px] line-clamp-1 mt-0.5",
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}
                  >
                    {sim.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Simulator Component View */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "logic-gates" && <LogicGatesSimulator />}
          {activeTab === "flip-flops" && <FlipFlopsSimulator />}
          {activeTab === "adders" && <AddersSimulator />}
          {activeTab === "rc-circuit" && <RCCircuitSimulator />}
          {activeTab === "counters" && <DigitalCountersSimulator />}
        </div>
      </div>
    </PublicLayout>
  );
}
