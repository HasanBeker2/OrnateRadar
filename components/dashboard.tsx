"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { mockDashboardData } from "@/data/mock-data";
import { MapComponent } from "@/components/map-component";
import { SummaryCards } from "@/components/summary-cards";
import { StatePanel } from "@/components/state-panel";
import { BrandDrilldown } from "@/components/brand-drilldown";
import { useDashboardStore } from "@/lib/store";

export function Dashboard() {
  const data = mockDashboardData;
  const { selectedState, selectedBrand, setSelectedBrand, metricMode, setMetricMode, dateRange, setDateRange } = useDashboardStore();
  const [stateCollapsed, setStateCollapsed] = useState(false);
  const [brandCollapsed, setBrandCollapsed] = useState(false);

  const totals = useMemo(() => {
    const spend = data.states.reduce((a, s) => a + s.spend, 0);
    const revenue = data.states.reduce((a, s) => a + s.revenue, 0);
    const conversions = data.states.reduce((a, s) => a + s.conversions, 0);
    const unitsSold = data.states.reduce((a, s) => a + s.unitsSold, 0);
    return { spend, revenue, roas: revenue / spend, conversionValue: revenue * 0.82, unitsSold, conversions };
  }, [data.states]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">

      {/* ── TOP HEADER ─────────────────────────────────── */}
      <header className="flex shrink-0 items-center gap-4 border-b border-cyan-900/40 bg-[#0d1f35]/90 px-5 py-2.5 backdrop-blur-md shadow-[0_1px_0_rgba(34,211,238,0.08)]">

        {/* Logo */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-800">
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          <span className="text-sm font-bold tracking-[0.18em] text-cyan-400 neon-cyan uppercase">OrnateRadar</span>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1">
          {(["7d", "30d", "90d", "custom"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                dateRange === d
                  ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {d === "7d" ? "7 Days" : d === "30d" ? "30 Days" : d === "90d" ? "90 Days" : "Custom"}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-800" />

        {/* Brand filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">Brand</span>
          <select
            value={selectedBrand ?? "all"}
            onChange={(e) => setSelectedBrand(e.target.value === "all" ? null : e.target.value)}
            className="rounded border border-slate-700/60 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Brands</option>
            {data.brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-800" />

        {/* State selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">State</span>
          <select
            value={selectedState ?? ""}
            onChange={(e) => useDashboardStore.getState().setSelectedState(e.target.value || null)}
            className="rounded border border-slate-700/60 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
          >
            <option value="">All States</option>
            {data.states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Heatmap toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => setMetricMode("spend")}
            className={`rounded px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all ${
              metricMode === "spend"
                ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Spend
          </button>
          <button
            onClick={() => setMetricMode("roas")}
            className={`rounded px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all ${
              metricMode === "roas"
                ? "bg-violet-500/20 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.25)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            ROAS
          </button>
        </div>
      </header>

      {/* ── MAP (tam ekran, tüm paneller üzerinde) ──────── */}
      <main className="relative flex-1 overflow-hidden">
        {/* Harita arka plan */}
        <div className="absolute inset-0 z-0">
          <MapComponent data={data} />
        </div>

        {/* Performance Overview — üst şerit */}
        <div className="absolute left-0 right-0 top-0 z-10 px-4 pt-3 pb-2 bg-gradient-to-b from-slate-950/85 to-transparent backdrop-blur-[2px]">
          <SummaryCards totals={totals} />
        </div>

        {/* State Detail — SAĞ */}
        <motion.div
          animate={{ width: stateCollapsed ? 36 : 520 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="absolute right-4 z-10 overflow-hidden rounded-xl border border-emerald-500/25 bg-slate-900/75 backdrop-blur-md shadow-[0_0_24px_rgba(52,211,153,0.12)]"
          style={{ top: "152px", maxHeight: "calc(100% - 164px)" }}
        >
          {stateCollapsed ? (
            /* Kapalı: dikey şerit */
            <button
              onClick={() => setStateCollapsed(false)}
              className="flex h-full w-full flex-col items-center justify-center gap-2 py-6"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                {selectedState ? `State: ${data.states.find(s => s.id === selectedState)?.name ?? selectedState}` : "State Detail"}
              </span>
            </button>
          ) : (
            /* Açık: tam panel */
            <div className="flex w-[520px] flex-col overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-500/20 bg-slate-900/90 px-4 py-2.5 backdrop-blur-sm">
                <SectionLabel color="emerald" label={selectedState ? `State: ${data.states.find(s => s.id === selectedState)?.name ?? selectedState}` : "State Detail"} />
                <button onClick={() => setStateCollapsed(true)} className="ml-2 text-slate-500 hover:text-emerald-400 transition-colors text-lg leading-none">‹</button>
              </div>
              <div className="p-4">
                <StatePanel data={data} stateId={selectedState} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Brand Drilldown — SOL */}
        <motion.div
          animate={{ width: brandCollapsed ? 36 : 520 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="absolute left-4 z-10 overflow-hidden rounded-xl border border-violet-500/25 bg-slate-900/75 backdrop-blur-md shadow-[0_0_24px_rgba(139,92,246,0.12)]"
          style={{ top: "152px", maxHeight: "calc(100% - 164px)" }}
        >
          {brandCollapsed ? (
            /* Kapalı: dikey şerit */
            <button
              onClick={() => setBrandCollapsed(false)}
              className="flex h-full w-full flex-col items-center justify-center gap-2 py-6"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                {selectedBrand ? `Brand: ${data.brands.find(b => b.id === selectedBrand)?.name ?? selectedBrand}` : "Brand Drill-down"}
              </span>
            </button>
          ) : (
            /* Açık: tam panel */
            <div className="flex w-[520px] flex-col overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-violet-500/20 bg-slate-900/90 px-4 py-2.5 backdrop-blur-sm">
                <SectionLabel color="violet" label={selectedBrand ? `Brand: ${data.brands.find(b => b.id === selectedBrand)?.name ?? selectedBrand}` : "Brand Drill-down"} />
                <button onClick={() => setBrandCollapsed(true)} className="ml-2 text-slate-500 hover:text-violet-400 transition-colors text-lg leading-none">›</button>
              </div>
              <div className="p-4">
                <BrandDrilldown data={data} brandId={selectedBrand} />
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan:    "text-cyan-400 neon-cyan    before:bg-cyan-400",
    emerald: "text-emerald-400 neon-emerald before:bg-emerald-400",
    violet:  "text-violet-400 neon-violet  before:bg-violet-400",
    amber:   "text-amber-400 neon-amber    before:bg-amber-400",
  };
  return (
    <div className={`mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] ${colorMap[color] ?? "text-slate-400"}`}>
      <div className={`h-1 w-4 rounded-full ${colorMap[color]?.split(" ").find(c => c.startsWith("before:"))?.replace("before:", "") ?? "bg-slate-400"}`} />
      {label}
    </div>
  );
}
