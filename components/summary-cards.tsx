"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { currency, number, percent } from "@/lib/utils";

interface SummaryCardsProps {
  totals: {
    spend: number;
    revenue: number;
    roas: number;
    conversionValue: number;
    unitsSold: number;
    conversions: number;
  };
}

const cards = (totals: SummaryCardsProps["totals"]) => [
  { label: "Total Spend",       value: currency(totals.spend),           trend: -2.1, color: "cyan"    },
  { label: "Revenue",           value: currency(totals.revenue),         trend:  8.2, color: "emerald" },
  { label: "ROAS",              value: percent(totals.roas),             trend:  3.4, color: "violet"  },
  { label: "Conversion Value",  value: currency(totals.conversionValue), trend:  6.5, color: "blue"    },
  { label: "Units Sold",        value: number(totals.unitsSold),         trend:  4.1, color: "emerald" },
  { label: "Conversions",       value: number(totals.conversions),       trend:  2.9, color: "cyan"    },
];

const colorMap: Record<string, { dot: string; bar: string; text: string; border: string }> = {
  cyan:    { dot: "bg-cyan-400",    bar: "from-cyan-500 to-cyan-300",    text: "text-cyan-400",    border: "border-cyan-500/25"   },
  violet:  { dot: "bg-violet-400",  bar: "from-violet-500 to-violet-300",text: "text-violet-400",  border: "border-violet-500/25" },
  emerald: { dot: "bg-emerald-400", bar: "from-emerald-500 to-emerald-300",text:"text-emerald-400",border: "border-emerald-500/25"},
  blue:    { dot: "bg-blue-400",    bar: "from-blue-500 to-blue-300",    text: "text-blue-400",    border: "border-blue-500/25"   },
  amber:   { dot: "bg-amber-400",   bar: "from-amber-500 to-amber-300",  text: "text-amber-400",   border: "border-amber-500/25"  },
};

export function SummaryCards({ totals }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards(totals).map((card) => {
        const c = colorMap[card.color];
        const positive = card.trend >= 0;
        return (
          <div key={card.label} className={`panel border ${c.border} p-4`}>
            <div className={`mb-3 h-0.5 w-full rounded-full bg-gradient-to-r ${c.bar} opacity-70`} />
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">{card.label}</p>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-slate-100">{card.value}</p>
            <p className={`mt-1.5 inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(card.trend)}% vs prior
            </p>
          </div>
        );
      })}
    </div>
  );
}
