"use client";

import { DateRange } from "@/lib/types";
import { useDashboardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const options: Array<{ label: string; value: DateRange }> = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Custom", value: "custom" }
];

export function DateRangeFilter() {
  const { dateRange, setDateRange } = useDashboardStore();

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={dateRange === option.value ? "default" : "outline"}
          onClick={() => setDateRange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
