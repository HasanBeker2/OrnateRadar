"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { animate as fmAnimate } from "framer-motion";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useDashboardStore } from "@/lib/store";
import { DashboardData } from "@/lib/types";
import { fipsToState } from "@/lib/us-state-meta";
import { deriveBrandStateMetrics } from "@/lib/derived";
import { stateCentroids, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/state-centroids";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const getHeatColor = (value: number, max: number, inactive: boolean) => {
  if (inactive) return "#1a2d45";
  if (!value || !max) return "#1e3a52";
  const ratio = value / max;
  if (ratio < 0.2) return "#164e63";
  if (ratio < 0.4) return "#0e7490";
  if (ratio < 0.6) return "#0891b2";
  if (ratio < 0.8) return "#06b6d4";
  return "#22d3ee";
};

export function MapComponent({ data }: { data: DashboardData }) {
  const { selectedState, setSelectedState, metricMode, selectedBrand } = useDashboardStore();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  const zoomRef = useRef(zoom);
  const centerRef = useRef(center);

  // Eyalet seçilince smooth animasyonlu zoom + merkez
  useEffect(() => {
    const target = selectedState && stateCentroids[selectedState]
      ? stateCentroids[selectedState]
      : { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };

    // zoom animasyonu
    fmAnimate(zoomRef.current, target.zoom, {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => { zoomRef.current = v; setZoom(v); },
    });

    // lng animasyonu
    fmAnimate(centerRef.current[0], target.center[0], {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => { centerRef.current = [v, centerRef.current[1]]; setCenter([v, centerRef.current[1]]); },
    });

    // lat animasyonu
    fmAnimate(centerRef.current[1], target.center[1], {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => { centerRef.current = [centerRef.current[0], v]; setCenter([centerRef.current[0], v]); },
    });
  }, [selectedState]);

  const brandStateMetrics = useMemo(
    () => (selectedBrand ? deriveBrandStateMetrics(data, selectedBrand) : null),
    [data, selectedBrand]
  );
  const baseStates = useMemo(
    () => Object.fromEntries(data.states.map((s) => [s.id, s])),
    [data.states]
  );
  const maxMetric = useMemo(() => {
    if (selectedBrand && brandStateMetrics)
      return Math.max(...Object.values(brandStateMetrics).map((s) => (metricMode === "spend" ? s.spend : s.roas)), 0);
    return Math.max(...data.states.map((s) => (metricMode === "spend" ? s.spend : s.roas)), 0);
  }, [brandStateMetrics, data.states, metricMode, selectedBrand]);

  const handleMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: [number, number]; zoom: number }) => {
    setCenter(coordinates);
    setZoom(z);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(10, Math.max(1, z - e.deltaY * 0.004)));
  }, []);

  return (
    <div className="relative h-full w-full" onWheel={handleWheel}>
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <button onClick={() => setZoom((z) => Math.min(10, z + 0.8))}
          className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/30 bg-slate-900/80 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-lg font-light">+</button>
        <button onClick={() => setZoom((z) => Math.max(1, z - 0.8))}
          className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/30 bg-slate-900/80 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-lg font-light">−</button>
        <button onClick={() => { setZoom(DEFAULT_ZOOM); setCenter(DEFAULT_CENTER); }}
          className="flex h-8 w-8 items-center justify-center rounded border border-slate-700/50 bg-slate-900/80 text-slate-400 hover:text-slate-200 transition-colors text-[10px]">↺</button>
      </div>

      {/* Seçili eyalet etiketi */}
      {selectedState && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-slate-900/80 px-3 py-1.5 backdrop-blur-sm">
          <div className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {data.states.find(s => s.id === selectedState)?.name ?? selectedState}
          </span>
          <button onClick={() => setSelectedState(null)} className="ml-1 text-slate-500 hover:text-slate-300 text-xs">✕</button>
        </div>
      )}

      {/* Heat mode badge */}
      {!selectedState && (
        <div className="absolute bottom-4 left-4 z-10 rounded border border-cyan-500/20 bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan-400/80">
          Heat: {metricMode === "spend" ? "Spend" : "ROAS"}
        </div>
      )}

      <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup zoom={zoom} center={center} onMoveEnd={handleMoveEnd}>
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
                  const isSelected = abbr === selectedState;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => abbr && setSelectedState(abbr)}
                      style={{
                        default: {
                          fill: isSelected ? "#f59e0b" : getHeatColor(value, maxMetric, inactive),
                          stroke: isSelected ? "#fbbf24" : "#0a1628",
                          strokeWidth: isSelected ? 2.5 / zoom : 0.4 / zoom,
                          outline: "none",
                          cursor: "pointer",
                          filter: isSelected
                            ? `drop-shadow(0 0 3px rgba(245,158,11,0.55))`
                            : "none",
                        },
                        hover: {
                          fill: isSelected ? "#fbbf24" : "#22d3ee",
                          stroke: "#67e8f9",
                          strokeWidth: 1 / zoom,
                          outline: "none",
                        },
                        pressed: { fill: "#fde68a", outline: "none" },
                      }}
                    >
                      <title>
                        {state?.name ?? abbr}: ${((brandMetrics?.spend ?? state?.spend ?? 0) / 1000).toFixed(0)}k spend · {(brandMetrics?.roas ?? state?.roas ?? 0).toFixed(2)}x ROAS
                      </title>
                    </Geography>
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
