'use client';

import React from 'react';
import { Printer, Redo2, Undo2 } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { VESSEL_FINISHES } from '@/lib/vessel-geometry';
import { downloadBlob } from '@/lib/parsers/project-io';
import { exportToSTL } from '@/lib/parsers/stl-exporter';
import type { VesselFinish, VesselParams } from '@/lib/cad-types';

interface SliderDef {
  key: keyof Omit<VesselParams, 'archetype' | 'finish'>;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const SLIDERS: SliderDef[] = [
  { key: 'baseRadius', label: 'Base radius', min: 30, max: 80, step: 1, format: (v) => `${v} mm` },
  { key: 'height', label: 'Height', min: 80, max: 220, step: 1, format: (v) => `${v} mm` },
  { key: 'wallThickness', label: 'Wall thickness', min: 2, max: 8, step: 0.5, format: (v) => `${v} mm` },
  { key: 'ribCount', label: 'Rib count', min: 0, max: 48, step: 1, format: (v) => (v === 0 ? 'smooth' : `${v}`) },
  { key: 'waveAmplitude', label: 'Wave', min: 0, max: 10, step: 0.5, format: (v) => `${v} mm` },
  { key: 'twistAngle', label: 'Twist', min: 0, max: 180, step: 5, format: (v) => `${v}°` },
];

const FINISH_ORDER: VesselFinish[] = ['sandstone', 'terracotta', 'porcelain'];

export default function VesselStudio(): React.JSX.Element {
  const vesselId = useCADStore((s) => s.vesselId);
  const nodes = useCADStore((s) => s.nodes);
  const undoStack = useCADStore((s) => s.undoStack);
  const redoStack = useCADStore((s) => s.redoStack);
  const setVesselParams = useCADStore((s) => s.setVesselParams);
  const beginVesselDrag = useCADStore((s) => s.beginVesselDrag);
  const commitVesselHistory = useCADStore((s) => s.commitVesselHistory);
  const updateNode = useCADStore((s) => s.updateNode);
  const undo = useCADStore((s) => s.undo);
  const redo = useCADStore((s) => s.redo);

  const vessel = nodes.find((n) => n.id === vesselId)?.vessel;
  if (!vessel) return <></>;

  const downloadSTL = () => {
    const node = nodes.find((n) => n.id === vesselId);
    if (!node) return;
    const blob = exportToSTL([node], true);
    downloadBlob(blob, `amonite-${vessel.archetype}.stl`);
  };

  return (
    <div className="w-72 rounded-xl border border-white/[0.07] bg-[#1e1a15]/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a89e8d]">
          Shape the clay
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            className="rounded-md p-1.5 text-[#a89e8d] transition-colors hover:bg-white/[0.06] hover:text-[#f2e9d8] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="rounded-md p-1.5 text-[#a89e8d] transition-colors hover:bg-white/[0.06] hover:text-[#f2e9d8] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Finish swatches */}
      <div className="grid grid-cols-3 gap-1.5 pb-4">
        {FINISH_ORDER.map((f) => {
          const spec = VESSEL_FINISHES[f];
          const isActive = vessel.finish === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => {
                if (vessel) updateNode(vesselId!, { vessel: { ...vessel, finish: f } });
              }}
              aria-pressed={isActive}
              title={spec.blurb}
              className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 transition-colors ${
                isActive ? 'bg-[#c96f4b]/10 outline outline-1 outline-[#c96f4b]/40' : 'hover:bg-white/[0.04]'
              }`}
            >
              <span
                className="h-7 w-7 rounded-full border border-white/20"
                style={{ backgroundColor: spec.color }}
              />
              <span className="text-[11px] text-[#d8cfbd]">{spec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Parametric sliders */}
      <div className="flex flex-col gap-4">
        {SLIDERS.map((s) => (
          <label key={s.key} className="block">
            <span className="flex items-baseline justify-between">
              <span className="text-xs text-[#d8cfbd]">{s.label}</span>
              <span className="font-mono text-[11px] text-[#a89e8d]">{s.format(vessel[s.key])}</span>
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={vessel[s.key]}
              onPointerDown={beginVesselDrag}
              onFocus={beginVesselDrag}
              onChange={(e) => setVesselParams({ [s.key]: Number(e.target.value) } as Partial<VesselParams>)}
              onPointerUp={commitVesselHistory}
              onKeyUp={commitVesselHistory}
              onBlur={commitVesselHistory}
              aria-label={s.label}
              className="mt-1.5 w-full accent-[#c96f4b]"
            />
          </label>
        ))}
      </div>

      <p className="pt-3 font-mono text-[10px] leading-4 text-[#8a8071]">
        Hollowed for printing · {vessel.wallThickness} mm walls · watertight solid
      </p>

      <button
        type="button"
        onClick={downloadSTL}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#ede4d3] px-3 py-2.5 text-xs font-bold text-[#221c14] transition-colors hover:bg-white"
      >
        <Printer className="h-4 w-4" />
        <span>Download print file (.stl)</span>
      </button>
    </div>
  );
}
