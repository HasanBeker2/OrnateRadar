import { DashboardData } from "@/lib/types";

export const mockDashboardData: DashboardData = {
  states: [
    { id: "CA", name: "California", spend: 240000, revenue: 690000, roas: 2.88, conversions: 5200, unitsSold: 7400 },
    { id: "TX", name: "Texas", spend: 167000, revenue: 413000, roas: 2.47, conversions: 3100, unitsSold: 4590 },
    { id: "FL", name: "Florida", spend: 129000, revenue: 286000, roas: 2.22, conversions: 2300, unitsSold: 3420 },
    { id: "NY", name: "New York", spend: 155000, revenue: 452000, roas: 2.92, conversions: 2870, unitsSold: 4010 },
    { id: "WA", name: "Washington", spend: 69000, revenue: 194000, roas: 2.81, conversions: 1120, unitsSold: 1580 },
    { id: "IL", name: "Illinois", spend: 98000, revenue: 242000, roas: 2.47, conversions: 1840, unitsSold: 2620 },
    { id: "GA", name: "Georgia", spend: 82000, revenue: 177000, roas: 2.16, conversions: 1400, unitsSold: 1930 },
    { id: "NC", name: "North Carolina", spend: 74000, revenue: 171000, roas: 2.31, conversions: 1300, unitsSold: 1770 },
    { id: "CO", name: "Colorado", spend: 52000, revenue: 139000, roas: 2.67, conversions: 990, unitsSold: 1380 },
    { id: "AZ", name: "Arizona", spend: 61000, revenue: 151000, roas: 2.48, conversions: 1080, unitsSold: 1510 }
  ],
  campaigns: [
    {
      id: "cmp-1",
      name: "Performance Max - Core",
      states: ["CA", "TX", "FL", "NY", "WA"],
      totalSpend: 335000,
      brandSplits: { "br-1": 0.45, "br-2": 0.35, "br-3": 0.2 },
      stateMetrics: {
        CA: { spend: 96000, revenue: 310000, roas: 3.23, conversions: 1700, unitsSold: 2310 },
        TX: { spend: 72000, revenue: 180000, roas: 2.5, conversions: 920, unitsSold: 1380 },
        FL: { spend: 58000, revenue: 134000, roas: 2.31, conversions: 760, unitsSold: 1090 },
        NY: { spend: 71000, revenue: 242000, roas: 3.41, conversions: 980, unitsSold: 1430 },
        WA: { spend: 38000, revenue: 112000, roas: 2.95, conversions: 540, unitsSold: 760 }
      }
    },
    {
      id: "cmp-2",
      name: "Shopping - Seasonal Growth",
      states: ["CA", "IL", "GA", "NC", "AZ"],
      totalSpend: 281000,
      brandSplits: { "br-2": 0.42, "br-3": 0.33, "br-4": 0.25 },
      stateMetrics: {
        CA: { spend: 78000, revenue: 186000, roas: 2.38, conversions: 1210, unitsSold: 1850 },
        IL: { spend: 57000, revenue: 136000, roas: 2.39, conversions: 930, unitsSold: 1320 },
        GA: { spend: 51000, revenue: 107000, roas: 2.1, conversions: 760, unitsSold: 1030 },
        NC: { spend: 46000, revenue: 101000, roas: 2.2, conversions: 680, unitsSold: 940 },
        AZ: { spend: 49000, revenue: 112000, roas: 2.29, conversions: 750, unitsSold: 1000 }
      }
    },
    {
      id: "cmp-3",
      name: "Search - High Intent",
      states: ["TX", "NY", "CO", "WA", "FL"],
      totalSpend: 252000,
      brandSplits: { "br-1": 0.3, "br-4": 0.38, "br-5": 0.32 },
      stateMetrics: {
        TX: { spend: 61000, revenue: 167000, roas: 2.74, conversions: 840, unitsSold: 1220 },
        NY: { spend: 52000, revenue: 154000, roas: 2.96, conversions: 760, unitsSold: 1080 },
        CO: { spend: 52000, revenue: 139000, roas: 2.67, conversions: 990, unitsSold: 1380 },
        WA: { spend: 31000, revenue: 82000, roas: 2.65, conversions: 410, unitsSold: 570 },
        FL: { spend: 56000, revenue: 152000, roas: 2.71, conversions: 820, unitsSold: 1160 }
      }
    }
  ],
  brands: [
    { id: "br-1", name: "Northline", campaigns: ["cmp-1", "cmp-3"], totalSpend: 226000 },
    { id: "br-2", name: "Auralis", campaigns: ["cmp-1", "cmp-2"], totalSpend: 267000 },
    { id: "br-3", name: "Peakwell", campaigns: ["cmp-1", "cmp-2"], totalSpend: 177000 },
    { id: "br-4", name: "Viron", campaigns: ["cmp-2", "cmp-3"], totalSpend: 163000 },
    { id: "br-5", name: "Caden", campaigns: ["cmp-3"], totalSpend: 81000 }
  ]
};
