import { NextResponse } from "next/server";
import { mockDashboardData } from "@/data/mock-data";

export async function GET() {
  return NextResponse.json({
    source: "mock",
    estimatedBrandByState: true,
    data: mockDashboardData
  });
}
