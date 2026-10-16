'use client';

import React from 'react';
import {
  Compass,
  Grid,
  Camera,
  Boxes,
  Magnet,
} from 'lucide-react';
import { useCADStore } from '@/store/cad-store';

export default function CADViewControls() {
  const viewport = useCADStore((s) => s.viewport);
  const activePreset = useCADStore((s) => s.activePreset);
  const cursorCoords = useCADStore((s) => s.cursorCoords);

  const setViewport = useCADStore((s) => s.setViewport);
  const setCameraPreset = useCADStore((s) => s.setCameraPreset);

  const presets = [
    { id: 'iso', label: 'ISO' },
    { id: 'top', label: 'TOP' },
    { id: 'front', label: 'FRONT' },
    { id: 'right', label: 'RIGHT' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* View Presets & Camera Projections */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#101216]/90 backdrop-blur-md border border-[#232733] rounded-xl shadow-xl text-xs font-mono">
        <div className="flex items-center gap-1 px-1.5 text-slate-400">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">VIEW</span>
        </div>

        {presets.map((p) => (
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

        {/* Projection Mode */}
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

        {/* Shading Style */}
        <button
          onClick={() =>
            setViewport({
              renderStyle:
                viewport.renderStyle === 'shaded' ? 'wireframe' : 'shaded',
            })
          }
          title="Toggle Wireframe / Shaded"
          className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${
            viewport.renderStyle === 'wireframe'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-[#161a22] hover:bg-slate-800 text-slate-300 border-[#272d3b]'
          }`}
        >
          <Boxes className="w-3 h-3 text-cyan-400" />
          <span>{viewport.renderStyle.toUpperCase()}</span>
        </button>

        {/* Grid & Snap */}
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
          <span>{viewport.snapStep}mm</span>
        </button>
      </div>

      {/* Coordinate Telemetry HUD */}
      <div className="self-end px-3 py-1 bg-[#101216]/90 backdrop-blur-md border border-[#232733] rounded-lg text-[11px] font-mono text-slate-400 flex items-center gap-3 shadow-lg">
        <div>
          <span className="text-red-400 font-bold">X:</span> {cursorCoords.x.toFixed(1)}
        </div>
        <div>
          <span className="text-green-400 font-bold">Y:</span> {cursorCoords.y.toFixed(1)}
        </div>
        <div>
          <span className="text-blue-400 font-bold">Z:</span> {cursorCoords.z.toFixed(1)}
        </div>
        <div className="text-cyan-400/80 font-bold uppercase">{viewport.unit}</div>
      </div>
    </div>
  );
}
