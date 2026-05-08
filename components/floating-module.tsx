"use client";

import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { Minus, Maximize2 } from "lucide-react";
import { useDashboardStore } from "@/lib/store";

const BASE_Z = 10;
const COLLAPSED_HEIGHT = 42;

interface FloatingModuleProps {
  id: string;
  title: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  minWidth?: number;
  children: React.ReactNode;
}

export function FloatingModule({
  id,
  title,
  defaultPosition,
  defaultSize,
  minWidth = 280,
  children
}: FloatingModuleProps) {
  const { moduleOrder, bringToFront } = useDashboardStore();
  const [collapsed, setCollapsed] = useState(false);
  const sizeBeforeCollapse = useRef(defaultSize.height);
  const rndRef = useRef<Rnd | null>(null);

  const zIndex = BASE_Z + moduleOrder.indexOf(id);

  function handleToggleCollapse() {
    if (!collapsed) {
      if (rndRef.current) {
        const current = rndRef.current.getSelfElement();
        sizeBeforeCollapse.current = current?.offsetHeight ?? defaultSize.height;
      }
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }

  return (
    <Rnd
      ref={rndRef}
      default={{ ...defaultPosition, ...defaultSize }}
      minWidth={minWidth}
      minHeight={COLLAPSED_HEIGHT}
      size={collapsed ? { width: defaultSize.width, height: COLLAPSED_HEIGHT } : undefined}
      disableDragging={false}
      dragHandleClassName="drag-handle"
      enableResizing={collapsed ? false : { bottom: true, right: true, bottomRight: true }}
      style={{ zIndex }}
      onMouseDown={() => bringToFront(id)}
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900/80 shadow-glow backdrop-blur-md"
        style={{ height: "100%" }}
      >
        {/* Title bar */}
        <div className="drag-handle flex cursor-grab items-center justify-between border-b border-cyan-500/15 px-3 py-2 active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            <span className="select-none text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
              {title}
            </span>
          </div>
          <button
            onClick={handleToggleCollapse}
            className="rounded p-0.5 text-slate-500 transition-colors hover:text-cyan-400"
          >
            {collapsed ? <Maximize2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Content */}
        {!collapsed && (
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {children}
          </div>
        )}
      </div>
    </Rnd>
  );
}
