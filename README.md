# Regional Performance Radar

Production-ready Next.js dashboard for Google Ads geographic, campaign, and brand performance with macro-to-micro drill-downs.

## Features

- Layer 1: Interactive US map (contiguous states only) with Spend/ROAS heat mode toggle
- Layer 2: State drill-down with campaign and estimated brand tables
- Layer 3: Brand drill-down map filtering + campaign coverage table + performance chart
- Estimated state × brand logic using proportional allocation
- Mock metrics API (`/api/metrics`) and Google Ads placeholder API (`/api/google-ads`)

## Tech

- Next.js App Router + TypeScript
- TailwindCSS + custom UI primitives (shadcn-style)
- Zustand state management
- Framer Motion animations
- Recharts visualization
- React Simple Maps

## Estimated logic

Google Ads does not expose exact state × brand intersections.

This MVP derives approximate metrics as:

`estimated_state_brand = state_campaign_metric * (brand_total_in_campaign / campaign_total)`

Estimated rows are clearly labeled in UI.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000
