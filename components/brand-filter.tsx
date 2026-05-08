"use client";

import { useDashboardStore } from "@/lib/store";
import { DashboardData } from "@/lib/types";

export function BrandFilter({ data }: { data: DashboardData }) {
  const { selectedBrand, setSelectedBrand } = useDashboardStore();

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">Brand Filter</p>
      <select
        value={selectedBrand ?? "all"}
        onChange={(e) => setSelectedBrand(e.target.value === "all" ? null : e.target.value)}
        className="w-full rounded border border-slate-700/50 bg-slate-800/60 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500/40"
      >
        <option value="all">All brands</option>
        {data.brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
}
