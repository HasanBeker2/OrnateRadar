"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DataTable, formatters } from "@/components/tables";
import { DashboardData } from "@/lib/types";
import { deriveBrandStateMetrics } from "@/lib/derived";

export function BrandDrilldown({ data, brandId }: { data: DashboardData; brandId: string | null }) {
  if (!brandId) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        ← Select a brand from the filter above
      </div>
    );
  }

  const brand = data.brands.find((b) => b.id === brandId);
  if (!brand) return null;

  const perState = deriveBrandStateMetrics(data, brandId);

  const campaigns = data.campaigns
    .filter((c) => c.brandSplits[brandId])
    .map((c) => {
      const share = c.brandSplits[brandId];
      const spend = Object.values(c.stateMetrics).reduce((a, v) => a + v.spend * share, 0);
      const revenue = Object.values(c.stateMetrics).reduce((a, v) => a + v.revenue * share, 0);
      const conversions = Object.values(c.stateMetrics).reduce((a, v) => a + v.conversions * share, 0);
      return {
        id: c.id, name: c.name,
        statesCovered: Object.keys(c.stateMetrics).filter((s) => perState[s]).join(", "),
        spend, revenue, roas: spend ? revenue / spend : 0, conversions,
      };
    });

  const chartData = Object.entries(perState).map(([state, m]) => ({
    state,
    spend:   Math.round(m.spend),
    revenue: Math.round(m.revenue),
  }));

  return (
    <div className="space-y-4">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.08)" />
            <XAxis dataKey="state" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-space)" }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-space)" }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-space)" }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
              cursor={{ fill: "rgba(139,92,246,0.06)" }}
            />
            <Bar dataKey="spend"   name="Spend"   fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable
        title="Campaigns carrying this brand"
        estimated
        rows={campaigns}
        columns={[
          { key: "name",          label: "Campaign"       },
          { key: "statesCovered", label: "States"         },
          { key: "spend",         label: "Spend (~)",     render: (r) => formatters.currency(r.spend) },
          { key: "roas",          label: "ROAS (~)",      render: (r) => formatters.percent(r.roas) },
          { key: "revenue",       label: "Revenue (~)",   render: (r) => formatters.currency(r.revenue) },
          { key: "conversions",   label: "Conv. (~)",     render: (r) => formatters.number(r.conversions) },
        ]}
      />
    </div>
  );
}
