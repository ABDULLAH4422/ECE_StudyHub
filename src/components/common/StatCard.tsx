import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  className,
  badge,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-md border bg-card transition-colors hover:border-border",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
        {(icon || badge) && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            {badge}
            {icon && (
              <div className="w-9 h-9 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
