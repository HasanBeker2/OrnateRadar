"use client";

import { DataTable, formatters } from "@/components/tables";
import { DashboardData } from "@/lib/types";
import { deriveStateBrandRows } from "@/lib/derived";

export function StatePanel({ data, stateId }: { data: DashboardData; stateId: string | null }) {
  if (!stateId) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        ← Select a state from the map or filter above
      </div>
    );
  }
  const state = data.states.find((item) => item.id === stateId);
  if (!state) return null;

  const campaignRows = data.campaigns
    .filter((c) => c.stateMetrics[stateId])
    .map((c) => ({ id: c.id, name: c.name, ...c.stateMetrics[stateId] }));

  const brandRows = deriveStateBrandRows(data, stateId)
    .filter((r) => r.spend > 0);

  return (
    <div className="space-y-4">
      {/* State summary metrics */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Spend",       value: formatters.currency(state.spend) },
          { label: "Revenue",     value: formatters.currency(state.revenue) },
          { label: "ROAS",        value: formatters.percent(state.roas) },
          { label: "Conversions", value: formatters.number(state.conversions) },
          { label: "Units Sold",  value: formatters.number(state.unitsSold) },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-emerald-500/15 bg-slate-800/50 p-3 text-center">
            <p className="text-[9px] font-medium uppercase tracking-widest text-emerald-400/70">{m.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DataTable
          title="Campaigns in State"
          rows={campaignRows}
          columns={[
            { key: "name",        label: "Campaign",    },
            { key: "spend",       label: "Spend",       render: (r) => formatters.currency(r.spend) },
            { key: "revenue",     label: "Revenue",     render: (r) => formatters.currency(r.revenue) },
            { key: "roas",        label: "ROAS",        render: (r) => formatters.percent(r.roas) },
            { key: "conversions", label: "Conversions", render: (r) => formatters.number(r.conversions) },
            { key: "unitsSold",   label: "Units",       render: (r) => formatters.number(r.unitsSold) },
          ]}
        />
        <DataTable
          title="Brands in State"
          rows={brandRows}
          estimated
          columns={[
            { key: "name",        label: "Brand",   },
            { key: "spend",       label: "Spend (~)",   render: (r) => formatters.currency(r.spend) },
            { key: "revenue",     label: "Revenue (~)", render: (r) => formatters.currency(r.revenue) },
            { key: "roas",        label: "ROAS (~)",    render: (r) => formatters.percent(r.roas) },
            { key: "conversions", label: "Conv. (~)",   render: (r) => formatters.number(r.conversions) },
          ]}
        />
      </div>
    </div>
  );
}
