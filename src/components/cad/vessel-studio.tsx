'use client';

import React, { useState } from 'react';
import {
  Printer,
  Redo2,
  Undo2,
  Sparkles,
  Flame,
  CheckCircle2,
  Loader2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { VESSEL_FINISHES } from '@/lib/vessel-geometry';
import { downloadBlob } from '@/lib/parsers/project-io';
import { exportToSTL } from '@/lib/parsers/stl-exporter';
import { generateEtsyBatchDrop } from '@/lib/batch-zip';
import type { VesselFinish, VesselParams } from '@/lib/cad-types';

interface SliderDef {
  key: keyof Omit<VesselParams, 'archetype' | 'finish' | 'shrinkagePercent'>;
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

const FINISH_ORDER: VesselFinish[] = ['sandstone', 'terracotta', 'porcelain', 'obsidian'];

const SHRINKAGE_PRESETS = [
  { label: 'None (0%)', value: 0, blurb: 'Standard 3D Print / Resin / PLA' },
  { label: 'Terracotta (+9.5%)', value: 9.5, blurb: 'Earthenware clay shrinkage' },
  { label: 'Stoneware (+11.8%)', value: 11.8, blurb: 'Mid-fire buff & speckled' },
  { label: 'Porcelain (+14.2%)', value: 14.2, blurb: 'High-fire ceramic glaze' },
];

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

  const [isKilnOpen, setIsKilnOpen] = useState(false);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  const vessel = nodes.find((n) => n.id === vesselId)?.vessel;
  if (!vessel) return <></>;

  const shrinkage = vessel.shrinkagePercent ?? 0;
  const compensatedHeight = (vessel.height * (1 + shrinkage / 100)).toFixed(1);

  const downloadSTL = () => {
    const node = nodes.find((n) => n.id === vesselId);
    if (!node) return;
    const blob = exportToSTL([node], true);
    const shrinkSuffix = shrinkage > 0 ? `-kiln-scaled-${shrinkage}pct` : '';
    downloadBlob(blob, `amonite-${vessel.archetype}${shrinkSuffix}.stl`);
  };

  const handleGenerateEtsyCollection = async () => {
    try {
      setIsGeneratingBatch(true);
      const zipBlob = await generateEtsyBatchDrop(vessel);
      downloadBlob(zipBlob, `amonite-${vessel.archetype}-etsy-drop.zip`);
    } catch (err) {
      console.error('Failed to generate Etsy batch collection:', err);
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  return (
    <div className="w-80 rounded-xl border border-white/[0.08] bg-[#1a1612]/95 p-4 shadow-2xl backdrop-blur-md max-h-[calc(100vh-120px)] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.14)_transparent]">
      {/* Header bar with undo/redo */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#c96f4b]" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a89e8d]">
            Shape the clay
          </p>
        </div>
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

      {/* Tactile Glaze & Material Swatches */}
      <div className="pt-3 pb-4">
        <p className="pb-2 font-mono text-[9px] uppercase tracking-wider text-[#8a8071]">
          Ceramic Finish & Glaze
        </p>
        <div className="grid grid-cols-4 gap-1.5">
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
                className={`group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all ${
                  isActive
                    ? 'bg-[#c96f4b]/15 outline outline-1 outline-[#c96f4b]/50 shadow-inner'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                {/* 3D Physical Material Sphere with specular glaze highlight */}
                <span
                  className="relative h-7 w-7 rounded-full shadow-md transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: spec.color,
                    backgroundImage:
                      'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)',
                    boxShadow: isActive
                      ? '0 0 0 2px #c96f4b, 0 4px 8px rgba(0,0,0,0.4)'
                      : '0 2px 5px rgba(0,0,0,0.3)',
                  }}
                />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-[#f2e9d8]' : 'text-[#a89e8d]'}`}>
                  {spec.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hairline Parametric Sliders */}
      <div className="flex flex-col gap-3 py-2 border-t border-white/[0.06]">
        {SLIDERS.map((s) => (
          <label key={s.key} className="block group">
            <span className="flex items-baseline justify-between text-xs">
              <span className="text-[#d8cfbd] font-medium">{s.label}</span>
              <span className="font-mono text-[11px] text-[#e0b99a] font-semibold">{s.format(vessel[s.key])}</span>
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
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-[#c96f4b] transition-all focus:outline-none"
            />
          </label>
        ))}
      </div>

      {/* Ceramic Kiln & Clay Shrinkage Tool */}
      <div className="mt-3 rounded-lg border border-[#c96f4b]/20 bg-[#c96f4b]/[0.04] p-2.5 transition-colors">
        <button
          type="button"
          onClick={() => setIsKilnOpen(!isKilnOpen)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-[#e07d57]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#f0caa3]">
              Kiln Shrinkage Tool
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] font-bold text-[#e07d57]">
              {shrinkage > 0 ? `+${shrinkage}%` : 'Off'}
            </span>
            {isKilnOpen ? (
              <ChevronUp className="h-3 w-3 text-[#a89e8d]" />
            ) : (
              <ChevronDown className="h-3 w-3 text-[#a89e8d]" />
            )}
          </div>
        </button>

        {isKilnOpen && (
          <div className="mt-2.5 space-y-2 pt-2 border-t border-[#c96f4b]/15">
            <div className="grid grid-cols-2 gap-1">
              {SHRINKAGE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setVesselParams({ shrinkagePercent: preset.value })}
                  className={`rounded px-2 py-1 text-left text-[10px] transition-colors ${
                    shrinkage === preset.value
                      ? 'bg-[#c96f4b]/25 font-bold text-[#f5dec8] border border-[#c96f4b]/40'
                      : 'bg-white/[0.03] text-[#a89e8d] hover:bg-white/[0.07]'
                  }`}
                  title={preset.blurb}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#a89e8d] pt-1">
              <span>Target Fired: {vessel.height}mm</span>
              <span className="text-[#e0b99a] font-semibold">Print Size: {compensatedHeight}mm</span>
            </div>
          </div>
        )}
      </div>

      {/* Printability & Slicer Certification Badge */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-emerald-200">
            Vase Mode & Print Certified
          </p>
          <p className="font-mono text-[9px] leading-3.5 text-emerald-300/80 mt-0.5">
            Watertight solid · 0° Overhangs &gt; 45° · {vessel.wallThickness}mm shell
          </p>
        </div>
      </div>

      {/* 1-Click "Etsy Collection Batch Generator" — The Money Feature.
          Sticky so it never scrolls out of reach below the fold. */}
      <div className="sticky bottom-0 -mx-4 -mb-4 mt-4 space-y-2 border-t border-white/[0.08] bg-[#1a1612]/95 px-4 pt-3 pb-4 backdrop-blur-md">
        <button
          type="button"
          onClick={handleGenerateEtsyCollection}
          disabled={isGeneratingBatch}
          className="group relative flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r from-[#d98560] via-[#c96f4b] to-[#b95f3b] p-3 text-center text-[#18130d] shadow-lg shadow-[#c96f4b]/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
            {isGeneratingBatch ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-200" />
            )}
            <span>{isGeneratingBatch ? 'Packaging Collection...' : 'Generate Etsy Collection (ZIP)'}</span>
          </div>
          <span className="mt-1 text-[10px] font-medium text-white/90">
            6 Scaled STLs · Studio Mockup PNGs · Etsy SEO Guide
          </span>
        </button>

        {/* Standard Single STL Export */}
        <button
          type="button"
          onClick={downloadSTL}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-[#ece5d8] transition-colors hover:bg-white/[0.1]"
        >
          <Printer className="h-3.5 w-3.5 text-[#d98f66]" />
          <span>Download print file (.stl)</span>
        </button>
      </div>
    </div>
  );
}
