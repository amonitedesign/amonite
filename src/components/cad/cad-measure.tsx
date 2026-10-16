'use client';

import React from 'react';
import { Ruler, X, MapPin } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import {
  angleXYDeg,
  distanceBetween,
  formatLength,
} from '@/lib/measurement';

export default function CADMeasure(): React.JSX.Element | null {
  const measureActive = useCADStore((s) => s.measureActive);
  const measurePoints = useCADStore((s) => s.measurePoints);
  const cursorCoords = useCADStore((s) => s.cursorCoords);
  const viewport = useCADStore((s) => s.viewport);
  const setMeasurePoints = useCADStore((s) => s.setMeasurePoints);
  const setMeasureActive = useCADStore((s) => s.setMeasureActive);

  if (!measureActive) return null;

  const setA = () =>
    setMeasurePoints({
      a: { ...cursorCoords },
      b: measurePoints?.b ?? { ...cursorCoords },
    });
  const setB = () =>
    setMeasurePoints({
      a: measurePoints?.a ?? { ...cursorCoords },
      b: { ...cursorCoords },
    });

  const dist = measurePoints ? distanceBetween(measurePoints.a, measurePoints.b) : 0;
  const ang = measurePoints ? angleXYDeg(measurePoints.a, measurePoints.b) : 0;
  const dx = measurePoints ? measurePoints.b.x - measurePoints.a.x : 0;
  const dy = measurePoints ? measurePoints.b.y - measurePoints.a.y : 0;
  const dz = measurePoints ? measurePoints.b.z - measurePoints.a.z : 0;

  return (
    <div className="w-64 rounded-xl border border-cyan-500/30 bg-[#101216]/95 p-3 font-mono text-xs text-slate-300 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-[#232733] pb-2">
        <span className="flex items-center gap-1.5 font-bold text-cyan-300">
          <Ruler className="h-3.5 w-3.5" /> CALIPERS
        </span>
        <button
          onClick={() => {
            setMeasurePoints(null);
            setMeasureActive(false);
          }}
          className="text-slate-500 hover:text-white"
          title="Close calipers (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        Hover the grid, then capture two points. All math is client-side in canonical mm.
      </p>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={setA}
          className="flex items-center justify-center gap-1 rounded-md border border-[#272d3b] bg-[#161a22] px-2 py-1.5 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <MapPin className="h-3 w-3" /> Set A
        </button>
        <button
          onClick={setB}
          className="flex items-center justify-center gap-1 rounded-md border border-[#272d3b] bg-[#161a22] px-2 py-1.5 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <MapPin className="h-3 w-3" /> Set B
        </button>
      </div>

      {measurePoints && (
        <dl className="mt-2 space-y-1 border-t border-[#232733] pt-2 text-[11px]">
          <div className="flex justify-between">
            <dt className="text-slate-500">Distance</dt>
            <dd className="font-bold text-white">{formatLength(dist, viewport.unit)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">ΔX / ΔY / ΔZ</dt>
            <dd className="text-slate-300">
              {formatLength(dx, viewport.unit, 1)} · {formatLength(dy, viewport.unit, 1)} ·{' '}
              {formatLength(dz, viewport.unit, 1)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Angle XY</dt>
            <dd className="text-slate-300">{ang.toFixed(1)}°</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
