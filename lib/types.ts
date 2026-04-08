export type DateRange = "7d" | "30d" | "90d" | "custom";

export interface StateMetric {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  unitsSold: number;
}

export interface CampaignStateMetrics {
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  unitsSold: number;
}

export interface Campaign {
  id: string;
  name: string;
  states: string[];
  totalSpend: number;
  stateMetrics: Record<string, CampaignStateMetrics>;
  brandSplits: Record<string, number>;
}

export interface Brand {
  id: string;
  name: string;
  campaigns: string[];
  totalSpend: number;
}

export interface DashboardData {
  states: StateMetric[];
  campaigns: Campaign[];
  brands: Brand[];
}
