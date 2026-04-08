"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { DataTable, formatters } from "@/components/tables";
import { DashboardData } from "@/lib/types";
import { deriveBrandStateMetrics } from "@/lib/derived";

export function BrandDrilldown({ data, brandId }: { data: DashboardData; brandId: string | null }) {
  if (!brandId) return null;

  const brand = data.brands.find((item) => item.id === brandId);
  if (!brand) return null;

  const perState = deriveBrandStateMetrics(data, brandId);

  const campaigns = data.campaigns
    .filter((campaign) => campaign.brandSplits[brandId])
    .map((campaign) => {
      const states = Object.keys(campaign.stateMetrics).filter((state) => perState[state]);
      const share = campaign.brandSplits[brandId];
      const spend = Object.values(campaign.stateMetrics).reduce((acc, cur) => acc + cur.spend * share, 0);
      const revenue = Object.values(campaign.stateMetrics).reduce((acc, cur) => acc + cur.revenue * share, 0);
      const conversions = Object.values(campaign.stateMetrics).reduce((acc, cur) => acc + cur.conversions * share, 0);
      return {
        id: campaign.id,
        name: campaign.name,
        statesCovered: states.join(", "),
        spend,
        roas: spend ? revenue / spend : 0,
        revenue,
        conversions
      };
    });

  const chartData = Object.entries(perState).map(([state, metrics]) => ({
    state,
    spend: Number(metrics.spend.toFixed(0)),
    revenue: Number(metrics.revenue.toFixed(0))
  }));

  return (
    <section className="space-y-4">
      <Card className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">Brand Drill-down: {brand.name}</h3>
        <p className="mt-1 text-xs text-slate-500">State-brand metrics are proportionally allocated and marked as estimated.</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spend" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="revenue" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <DataTable
        title="Campaigns carrying this brand"
        estimated
        rows={campaigns}
        columns={[
          { key: "name", label: "Campaign Name" },
          { key: "statesCovered", label: "States Covered" },
          { key: "spend", label: "Spend (~)", render: (row) => formatters.currency(row.spend) },
          { key: "roas", label: "ROAS (~)", render: (row) => formatters.percent(row.roas) },
          { key: "revenue", label: "Revenue (~)", render: (row) => formatters.currency(row.revenue) },
          { key: "conversions", label: "Conversions (~)", render: (row) => formatters.number(row.conversions) }
        ]}
      />
    </section>
  );
}
