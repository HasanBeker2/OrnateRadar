"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DataTable, formatters } from "@/components/tables";
import { DashboardData } from "@/lib/types";
import { deriveStateBrandRows } from "@/lib/derived";

export function StatePanel({ data, stateId }: { data: DashboardData; stateId: string | null }) {
  if (!stateId) return null;
  const state = data.states.find((item) => item.id === stateId);
  if (!state) return null;

  const campaignRows = data.campaigns
    .filter((campaign) => campaign.stateMetrics[stateId])
    .map((campaign) => {
      const metrics = campaign.stateMetrics[stateId];
      return { id: campaign.id, name: campaign.name, ...metrics };
    });

  const brandRows = deriveStateBrandRows(data, stateId)
    .filter((row) => row.spend > 0)
    .map((row) => ({ ...row, id: row.id }));

  return (
    <motion.section
      id="state-panel"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 lg:grid-cols-[320px_1fr]"
    >
      <Card className="p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500">State Drill-down</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{state.name}</h3>
        <div className="mt-6 space-y-3 text-sm">
          <Metric label="Spend" value={formatters.currency(state.spend)} />
          <Metric label="Revenue" value={formatters.currency(state.revenue)} />
          <Metric label="ROAS" value={formatters.percent(state.roas)} />
          <Metric label="Conversions" value={formatters.number(state.conversions)} />
          <Metric label="Units Sold" value={formatters.number(state.unitsSold)} />
        </div>
      </Card>

      <div className="space-y-4">
        <DataTable
          title="Campaigns in State"
          rows={campaignRows}
          columns={[
            { key: "name", label: "Campaign Name" },
            { key: "spend", label: "Spend", render: (row) => formatters.currency(row.spend) },
            { key: "revenue", label: "Revenue", render: (row) => formatters.currency(row.revenue) },
            { key: "roas", label: "ROAS", render: (row) => formatters.percent(row.roas) },
            { key: "conversions", label: "Conversions", render: (row) => formatters.number(row.conversions) },
            { key: "unitsSold", label: "Units Sold", render: (row) => formatters.number(row.unitsSold) }
          ]}
        />

        <DataTable
          title="Brands in State"
          rows={brandRows}
          estimated
          columns={[
            { key: "name", label: "Brand" },
            { key: "spend", label: "Spend (~)", render: (row) => formatters.currency(row.spend) },
            { key: "revenue", label: "Revenue (~)", render: (row) => formatters.currency(row.revenue) },
            { key: "roas", label: "ROAS (~)", render: (row) => formatters.percent(row.roas) },
            { key: "conversions", label: "Conversions (~)", render: (row) => formatters.number(row.conversions) },
            { key: "unitsSold", label: "Units Sold (~)", render: (row) => formatters.number(row.unitsSold) }
          ]}
        />
      </div>
    </motion.section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
