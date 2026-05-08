import { create } from "zustand";
import { mockDashboardData } from "@/data/mock-data";
import { DateRange } from "@/lib/types";

const MODULE_IDS = ["filters", "summary", "state", "brand"];

interface DashboardStore {
  selectedState: string | null;
  selectedBrand: string | null;
  metricMode: "spend" | "roas";
  dateRange: DateRange;
  moduleOrder: string[];
  setSelectedState: (state: string | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  setMetricMode: (mode: "spend" | "roas") => void;
  setDateRange: (range: DateRange) => void;
  bringToFront: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedState: mockDashboardData.states[0]?.id ?? null,
  selectedBrand: null,
  metricMode: "spend",
  dateRange: "30d",
  moduleOrder: [...MODULE_IDS],
  setSelectedState: (selectedState) => set({ selectedState }),
  setSelectedBrand: (selectedBrand) => set({ selectedBrand }),
  setMetricMode: (metricMode) => set({ metricMode }),
  setDateRange: (dateRange) => set({ dateRange }),
  bringToFront: (id) =>
    set((state) => ({
      moduleOrder: [...state.moduleOrder.filter((m) => m !== id), id]
    }))
}));
