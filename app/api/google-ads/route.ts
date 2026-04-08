import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    provider: "google-ads",
    mode: "placeholder",
    message:
      "Implement OAuth2 + GAQL queries for geographic_view, campaign metrics, and shopping performance report. Fallback to /api/metrics for mock data.",
    readOnly: true
  });
}
