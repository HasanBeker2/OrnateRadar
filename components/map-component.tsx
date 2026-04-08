"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Card } from "@/components/ui/card";
import { useDashboardStore } from "@/lib/store";
import { DashboardData } from "@/lib/types";
import { fipsToState } from "@/lib/us-state-meta";
import { currency, number, percent } from "@/lib/utils";
import { deriveBrandStateMetrics } from "@/lib/derived";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const getHeatColor = (value: number, max: number) => {
  if (!value || !max) return "#E2E8F0";
  const ratio = value / max;
  if (ratio < 0.2) return "#DBEAFE";
  if (ratio < 0.4) return "#BFDBFE";
  if (ratio < 0.6) return "#93C5FD";
  if (ratio < 0.8) return "#818CF8";
  return "#4F46E5";
};

export function MapComponent({ data }: { data: DashboardData }) {
  const { selectedState, setSelectedState, metricMode, selectedBrand } = useDashboardStore();

  const brandStateMetrics = useMemo(
    () => (selectedBrand ? deriveBrandStateMetrics(data, selectedBrand) : null),
    [data, selectedBrand]
  );

  const baseStates = useMemo(() => Object.fromEntries(data.states.map((state) => [state.id, state])), [data.states]);

  const maxMetric = useMemo(() => {
    if (selectedBrand && brandStateMetrics) {
      return Math.max(...Object.values(brandStateMetrics).map((state) => (metricMode === "spend" ? state.spend : state.roas)), 0);
    }
    return Math.max(...data.states.map((state) => (metricMode === "spend" ? state.spend : state.roas)), 0);
  }, [brandStateMetrics, data.states, metricMode, selectedBrand]);

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">US Performance Overview</h3>
        <div className="rounded-lg bg-slate-100 p-1 text-xs text-slate-600">Heat: {metricMode === "spend" ? "Spend" : "ROAS"}</div>
      </div>
      <ComposableMap projection="geoAlbersUsa" className="w-full">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              .filter((geo) => !["02", "15"].includes(String(geo.id).padStart(2, "0")))
              .map((geo) => {
                const abbr = fipsToState[String(geo.id).padStart(2, "0")];
                const state = abbr ? baseStates[abbr] : undefined;
                const brandMetrics = abbr && brandStateMetrics ? brandStateMetrics[abbr] : undefined;
                const value = metricMode === "spend" ? brandMetrics?.spend ?? state?.spend ?? 0 : brandMetrics?.roas ?? state?.roas ?? 0;
                const inactive = selectedBrand ? !brandMetrics : false;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => abbr && setSelectedState(abbr)}
                    style={{
                      default: {
                        fill: inactive ? "#E5E7EB" : getHeatColor(value, maxMetric),
                        stroke: "#fff",
                        strokeWidth: 0.6,
                        outline: "none"
                      },
                      hover: { fill: inactive ? "#D1D5DB" : "#312E81", outline: "none" },
                      pressed: { fill: "#1E1B4B", outline: "none" }
                    }}
                  >
                    <title>
                      {state?.name ?? abbr}: {currency(brandMetrics?.spend ?? state?.spend ?? 0)} spend · {percent(brandMetrics?.roas ?? state?.roas ?? 0)} ROAS · {number(brandMetrics?.conversions ?? state?.conversions ?? 0)} conversions
                    </title>
                  </Geography>
                );
              })
          }
        </Geographies>
      </ComposableMap>
      {selectedState && <p className="mt-2 text-xs text-slate-500">Selected state: <span className="font-medium text-slate-700">{selectedState}</span></p>}
    </Card>
  );
}
