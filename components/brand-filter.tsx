"use client";

import { useDashboardStore } from "@/lib/store";
import { DashboardData } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BrandFilter({ data }: { data: DashboardData }) {
  const { selectedBrand, setSelectedBrand } = useDashboardStore();

  return (
    <div className="w-full max-w-xs">
      <Select value={selectedBrand ?? "all"} onValueChange={(v) => setSelectedBrand(v === "all" ? null : v)}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All brands</SelectItem>
          {data.brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
