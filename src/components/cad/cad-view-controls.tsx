'use client';

import React from 'react';
import {
  Compass,
  Grid,
  Camera,
  Boxes,
  Magnet,
  Ruler,
} from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { SNAP_OPTIONS } from '@/lib/grid-utils';
import { formatLength, fromMM } from '@/lib/measurement';
import type { CameraPreset, LengthUnit, RenderStyle } from '@/lib/cad-types';

const PRESETS: Array<{ id: CameraPreset; label: string }> = [
  { id: 'iso', label: 'ISO' },
  { id: 'top', label: 'TOP' },
  { id: 'front', label: 'FRONT' },
  { id: 'right', label: 'RIGHT' },
  { id: 'bottom', label: 'BOT' },
  { id: 'back', label: 'BACK' },
  { id: 'left', label: 'LEFT' },
];

const RENDER_CYCLE: RenderStyle[] = ['shaded', 'wireframe', 'hidden-line'];

export default function CADViewControls() {
  const viewport = useCADStore((s) => s.viewport);
  const activePreset = useCADStore((s) => s.activePreset);
  const cursorCoords = useCADStore((s) => s.cursorCoords);
  const measureActive = useCADStore((s) => s.measureActive);

  const setViewport = useCADStore((s) => s.setViewport);
  const setCameraPreset = useCADStore((s) => s.setCameraPreset);
  const setMeasureActive = useCADStore((s) => s.setMeasureActive);
  const setMeasurePoints = useCADStore((s) => s.setMeasurePoints);

  const cycleRenderStyle = () => {
    const idx = RENDER_CYCLE.indexOf(viewport.renderStyle);
    setViewport({ renderStyle: RENDER_CYCLE[(idx + 1) % RENDER_CYCLE.length] });
  };

  const toggleUnit = () => {
    const next: LengthUnit = viewport.unit === 'mm' ? 'in' : 'mm';
    setViewport({ unit: next });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-1.5 p-1.5 bg-[#101216]/90 backdrop-blur-md border border-[#232733] rounded-xl shadow-xl text-xs font-mono">
        <div className="flex items-center gap-1 px-1.5 text-slate-400">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">VIEW</span>
        </div>

        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setCameraPreset(p.id)}
            className={`px-2 py-1 rounded-md transition-all ${
              activePreset === p.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {p.label}
          </button>
        ))}

        <div className="w-[1px] h-4 bg-[#232733] mx-1" />

        <button
          onClick={() =>
            setViewport({
              cameraMode:
                viewport.cameraMode === 'perspective'
                  ? 'orthographic'
                  : 'perspective',
            })
          }
          title="Toggle Perspective / Orthographic Camera"
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#161a22] hover:bg-slate-800 text-slate-300 border border-[#272d3b]"
        >
          <Camera className="w-3 h-3 text-cyan-400" />
          <span>{viewport.cameraMode === 'perspective' ? 'PERSP' : 'ORTHO'}</span>
        </button>

        <button
          onClick={cycleRenderStyle}
          title="Cycle Shaded / Wireframe / Hidden-line"
          className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${
            viewport.renderStyle !== 'shaded'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-[#161a22] hover:bg-slate-800 text-slate-300 border-[#272d3b]'
          }`}
        >
          <Boxes className="w-3 h-3 text-cyan-400" />
          <span>{viewport.renderStyle.toUpperCase()}</span>
        </button>

        <button
          onClick={() => setViewport({ gridVisible: !viewport.gridVisible })}
          title="Toggle CAD Snap Grid"
          className={`p-1.5 rounded-md border transition-all ${
            viewport.gridVisible
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-[#161a22] text-slate-500 border-[#272d3b]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setViewport({ snapToGrid: !viewport.snapToGrid })}
          title="Toggle Grid Snapping"
          className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${
            viewport.snapToGrid
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-[#161a22] text-slate-500 border-[#272d3b]'
          }`}
        >
          <Magnet className="w-3 h-3" />
          <span>{formatLength(viewport.snapStep, viewport.unit, viewport.unit === 'mm' ? 0 : 3)}</span>
        </button>

        <select
          aria-label="Snap step"
          value={viewport.snapStep}
          onChange={(e) => setViewport({ snapStep: Number(e.target.value) })}
          className="bg-[#161a22] border border-[#272d3b] rounded-md px-1.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-400"
        >
          {SNAP_OPTIONS.map((s) => (
            <option key={s} value={s}>
              snap {s}mm
            </option>
          ))}
        </select>

        <button
          onClick={toggleUnit}
          title="Toggle mm / inch units (canonical storage stays mm)"
          className="px-2 py-1 rounded-md bg-[#161a22] hover:bg-slate-800 text-slate-300 border border-[#272d3b] font-bold"
        >
          {viewport.unit.toUpperCase()}
        </button>

        <button
          onClick={() => {
            if (measureActive) setMeasurePoints(null);
            setMeasureActive(!measureActive);
          }}
          title="Measurement calipers (M) — click two points"
          className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${
            measureActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-[#161a22] text-slate-400 hover:text-slate-200 border-[#272d3b]'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>MEASURE</span>
        </button>
      </div>

      <div className="self-end px-3 py-1 bg-[#101216]/90 backdrop-blur-md border border-[#232733] rounded-lg text-[11px] font-mono text-slate-400 flex items-center gap-3 shadow-lg">
        <div>
          <span className="text-red-400 font-bold">X:</span>{' '}
          {fromMM(cursorCoords.x, viewport.unit).toFixed(viewport.unit === 'mm' ? 1 : 3)}
        </div>
        <div>
          <span className="text-green-400 font-bold">Y:</span>{' '}
          {fromMM(cursorCoords.y, viewport.unit).toFixed(viewport.unit === 'mm' ? 1 : 3)}
        </div>
        <div>
          <span className="text-blue-400 font-bold">Z:</span>{' '}
          {fromMM(cursorCoords.z, viewport.unit).toFixed(viewport.unit === 'mm' ? 1 : 3)}
        </div>
        <div className="text-cyan-400/80 font-bold uppercase">{viewport.unit}</div>
      </div>
    </div>
  );
}
