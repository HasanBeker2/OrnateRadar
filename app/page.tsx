"use client";

import { useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { mockDashboardData } from "@/data/mock-data";
import { DateRangeFilter } from "@/components/date-range-filter";
import { SummaryCards } from "@/components/summary-cards";
import { MapComponent } from "@/components/map-component";
import { StatePanel } from "@/components/state-panel";
import { BrandFilter } from "@/components/brand-filter";
import { BrandDrilldown } from "@/components/brand-drilldown";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store";

export default function DashboardPage() {
  const data = mockDashboardData;
  const statePanelRef = useRef<HTMLDivElement | null>(null);
  const { selectedState, selectedBrand, metricMode, setMetricMode } = useDashboardStore();

  const totals = useMemo(() => {
    const spend = data.states.reduce((acc, state) => acc + state.spend, 0);
    const revenue = data.states.reduce((acc, state) => acc + state.revenue, 0);
    const conversions = data.states.reduce((acc, state) => acc + state.conversions, 0);
    const unitsSold = data.states.reduce((acc, state) => acc + state.unitsSold, 0);
    return {
      spend,
      revenue,
      roas: revenue / spend,
      conversionValue: revenue * 0.82,
      unitsSold,
      conversions
    };
  }, [data.states]);

  return (
    <main className="mx-auto max-w-[1400px] space-y-6 p-6">
      <header className="card-surface p-6">
        <p className="text-sm font-medium text-blue-600">Regional Performance Radar</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Regional Performance Radar</h1>
        <p className="mt-1 text-slate-500">Google Ads Geo + Campaign + Brand Dashboard</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <DateRangeFilter />
          <BrandFilter data={data} />
        </div>
      </header>

      <SummaryCards totals={totals} />

      <section className="grid gap-4">
        <div className="flex items-center justify-end gap-2">
          <Button variant={metricMode === "spend" ? "default" : "outline"} size="sm" onClick={() => setMetricMode("spend")}>Spend Heatmap</Button>
          <Button variant={metricMode === "roas" ? "default" : "outline"} size="sm" onClick={() => setMetricMode("roas")}>ROAS Heatmap</Button>
        </div>
        <MapComponent data={data} />
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => statePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            Jump to State Drill-down
          </Button>
        </div>
      </section>

      <div ref={statePanelRef}>
        <AnimatePresence>
          <StatePanel data={data} stateId={selectedState} />
        </AnimatePresence>
      </div>

      <BrandDrilldown data={data} brandId={selectedBrand} />
    </main>
  );
}
