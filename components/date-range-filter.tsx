"use client";

import { DateRange } from "@/lib/types";
import { useDashboardStore } from "@/lib/store";

const options: Array<{ label: string; value: DateRange }> = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "Custom", value: "custom" }
];

export function DateRangeFilter() {
  const { dateRange, setDateRange } = useDashboardStore();

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">Date Range</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setDateRange(option.value)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              dateRange === option.value
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
