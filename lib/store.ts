import { create } from "zustand";
import { mockDashboardData } from "@/data/mock-data";
import { DateRange } from "@/lib/types";

interface DashboardStore {
  selectedState: string | null;
  selectedBrand: string | null;
  metricMode: "spend" | "roas";
  dateRange: DateRange;
  setSelectedState: (state: string | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  setMetricMode: (mode: "spend" | "roas") => void;
  setDateRange: (range: DateRange) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedState: mockDashboardData.states[0]?.id ?? null,
  selectedBrand: null,
  metricMode: "spend",
  dateRange: "30d",
  setSelectedState: (selectedState) => set({ selectedState }),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),
  setMetricMode: (metricMode) => set({ metricMode }),
  setDateRange: (dateRange) => set({ dateRange })
}));
