"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  { label: "Total Spend", value: currency(totals.spend), trend: -2.1 },
  { label: "Revenue", value: currency(totals.revenue), trend: 8.2 },
  { label: "ROAS", value: percent(totals.roas), trend: 3.4 },
  { label: "Conversion Value", value: currency(totals.conversionValue), trend: 6.5 },
  { label: "Units Sold", value: number(totals.unitsSold), trend: 4.1 },
  { label: "Conversions", value: number(totals.conversions), trend: 2.9 }
];

export function SummaryCards({ totals }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {cards(totals).map((card, index) => {
        const positive = card.trend >= 0;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="relative overflow-hidden p-4">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{card.value}</p>
              <p className={`mt-2 inline-flex items-center text-xs ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                {positive ? <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-1 h-3.5 w-3.5" />}
                {Math.abs(card.trend)}% vs prior period
              </p>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
