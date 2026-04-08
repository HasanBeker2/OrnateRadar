import { DashboardData } from "@/lib/types";

export const deriveBrandStateMetrics = (data: DashboardData, brandId: string) => {
  const targetBrand = data.brands.find((brand) => brand.id === brandId);
  if (!targetBrand) return {} as Record<string, { spend: number; revenue: number; conversions: number; unitsSold: number; roas: number }>;

  const accumulator: Record<string, { spend: number; revenue: number; conversions: number; unitsSold: number; roas: number }> = {};

  for (const campaign of data.campaigns) {
    const share = campaign.brandSplits[brandId];
    if (!share) continue;

    for (const [state, metrics] of Object.entries(campaign.stateMetrics)) {
      if (!accumulator[state]) {
        accumulator[state] = { spend: 0, revenue: 0, conversions: 0, unitsSold: 0, roas: 0 };
      }

      accumulator[state].spend += metrics.spend * share;
      accumulator[state].revenue += metrics.revenue * share;
      accumulator[state].conversions += metrics.conversions * share;
      accumulator[state].unitsSold += metrics.unitsSold * share;
    }
  }

  Object.values(accumulator).forEach((metric) => {
    metric.roas = metric.spend ? metric.revenue / metric.spend : 0;
  });

  return accumulator;
};

export const deriveStateBrandRows = (data: DashboardData, stateId: string) => {
  return data.brands.map((brand) => {
    let spend = 0;
    let revenue = 0;
    let conversions = 0;
    let unitsSold = 0;

    data.campaigns.forEach((campaign) => {
      const stateMetrics = campaign.stateMetrics[stateId];
      const share = campaign.brandSplits[brand.id];
      if (!stateMetrics || !share) return;

      spend += stateMetrics.spend * share;
      revenue += stateMetrics.revenue * share;
      conversions += stateMetrics.conversions * share;
      unitsSold += stateMetrics.unitsSold * share;
    });

    return {
      id: brand.id,
      name: brand.name,
      spend,
      revenue,
      roas: spend ? revenue / spend : 0,
      conversions,
      unitsSold,
      estimated: true
    };
  });
};
