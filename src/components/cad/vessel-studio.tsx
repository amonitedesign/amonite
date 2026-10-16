'use client';

import React, { useState } from 'react';
import {
  Printer,
  Redo2,
  Undo2,
  Sparkles,
  Flame,
  Loader2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { VESSEL_FINISHES } from '@/lib/vessel-geometry';
import { STUDIO_THEME } from '@/lib/studio-theme';
import { formatMeasure } from '@/lib/units';
import { downloadBlob } from '@/lib/parsers/project-io';
import { exportToSTL } from '@/lib/parsers/stl-exporter';
import { generateEtsyBatchDrop } from '@/lib/batch-zip';
import type { VesselFinish, VesselParams, LengthUnit } from '@/lib/cad-types';

interface SliderDef {
  key: keyof Omit<VesselParams, 'archetype' | 'finish' | 'shrinkagePercent'>;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number, unit: LengthUnit) => string;
}

const SLIDERS: SliderDef[] = [
  { key: 'baseRadius', label: 'Base radius', min: 30, max: 80, step: 1, format: (v, u) => formatMeasure(v, u) },
  { key: 'height', label: 'Height', min: 60, max: 320, step: 1, format: (v, u) => formatMeasure(v, u) },
  { key: 'wallThickness', label: 'Wall thickness', min: 2, max: 8, step: 0.5, format: (v, u) => formatMeasure(v, u) },
  { key: 'ribCount', label: 'Rib count', min: 0, max: 48, step: 1, format: (v) => (v === 0 ? 'smooth' : `${v}`) },
  { key: 'waveAmplitude', label: 'Wave', min: 0, max: 10, step: 0.5, format: (v, u) => formatMeasure(v, u) },
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
  const theme = useCADStore((s) => s.settings.theme);
  const unit = useCADStore((s) => s.viewport.unit);
  const t = STUDIO_THEME[theme].chrome;

  const [isKilnOpen, setIsKilnOpen] = useState(false);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  const vessel = nodes.find((n) => n.id === vesselId)?.vessel;
  if (!vessel) return <></>;

  const shrinkage = vessel.shrinkagePercent ?? 0;

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
    <div
      className="flex h-full w-full flex-col p-4 overflow-y-auto [scrollbar-width:thin] select-none"
    >
      {/* Header bar with undo/redo */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${t.hairline}` }}>
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" style={{ color: t.accent }} />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.inkMute }}>
            Shape the clay
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            className="rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: t.inkMute }}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: t.inkMute }}
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tactile Glaze & Material Swatches */}
      <div className="pt-3 pb-4">
        <p className="pb-2 font-mono text-[9px] uppercase tracking-wider" style={{ color: t.inkFaint }}>
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
                className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all"
                style={isActive ? { backgroundColor: `${t.accent}26`, outline: `1px solid ${t.accent}66` } : undefined}
              >
                {/* 3D Physical Material Sphere with specular glaze highlight */}
                <span
                  className="relative h-7 w-7 rounded-full shadow-md transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: spec.color,
                    backgroundImage:
                      'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)',
                    boxShadow: isActive
                      ? `0 0 0 2px ${t.accent}, 0 4px 8px rgba(0,0,0,0.4)`
                      : '0 2px 5px rgba(0,0,0,0.3)',
                  }}
                />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : ''}`} style={{ color: isActive ? t.ink : t.inkMute }}>
                  {spec.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hairline Parametric Sliders */}
      <div className="flex flex-col gap-3 py-2" style={{ borderTop: `1px solid ${t.hairline}` }}>
        {SLIDERS.map((s) => (
          <label key={s.key} className="block group">
            <span className="flex items-baseline justify-between text-xs">
              <span className="font-medium" style={{ color: t.inkSoft }}>{s.label}</span>
              <span className="font-mono text-[11px] font-semibold" style={{ color: t.accentSoft }}>{s.format(vessel[s.key], unit)}</span>
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
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg transition-all focus:outline-none accent-[#c96f4b]"
              style={{ backgroundColor: t.wellBg }}
            />
          </label>
        ))}
      </div>

      {/* Ceramic Kiln & Clay Shrinkage Tool */}
      <div className="mt-3 rounded-lg border p-2.5 transition-colors" style={{ borderColor: `${t.accent}33`, backgroundColor: `${t.accent}0a` }}>
        <button
          type="button"
          onClick={() => setIsKilnOpen(!isKilnOpen)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5" style={{ color: t.accentSoft }} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.inkSoft }}>
              Kiln Shrinkage Tool
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] font-bold" style={{ color: t.accentSoft }}>
              {shrinkage > 0 ? `+${shrinkage}%` : 'Off'}
            </span>
            {isKilnOpen ? (
              <ChevronUp className="h-3 w-3" style={{ color: t.inkMute }} />
            ) : (
              <ChevronDown className="h-3 w-3" style={{ color: t.inkMute }} />
            )}
          </div>
        </button>

        {isKilnOpen && (
          <div className="mt-2.5 space-y-2 pt-2" style={{ borderTop: `1px solid ${t.accent}26` }}>
            <div className="grid grid-cols-2 gap-1">
              {SHRINKAGE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setVesselParams({ shrinkagePercent: preset.value })}
                  className="rounded px-2 py-1 text-left text-[10px] transition-colors"
                  style={
                    shrinkage === preset.value
                      ? { backgroundColor: `${t.accent}40`, color: t.ink, border: `1px solid ${t.accent}66`, fontWeight: 'bold' }
                      : { backgroundColor: t.wellBg, color: t.inkMute }
                  }
                  title={preset.blurb}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono pt-1" style={{ color: t.inkMute }}>
              <span>Target Fired: {formatMeasure(vessel.height, unit)}</span>
              <span className="font-semibold" style={{ color: t.accentSoft }}>
                Print Size: {formatMeasure(vessel.height * (1 + shrinkage / 100), unit)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Export actions. Sticky so they never scroll out of reach below the fold. */}
      <div
        className="sticky bottom-0 -mx-4 -mb-4 mt-4 space-y-2 border-t px-4 pt-3 pb-4 backdrop-blur-md"
        style={{ borderColor: t.hairline, backgroundColor: t.panelBg }}
      >
        <button
          type="button"
          onClick={handleGenerateEtsyCollection}
          disabled={isGeneratingBatch}
          className="group relative flex w-full flex-col items-center justify-center rounded-lg p-3 text-center transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: t.accent }}
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
          className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
          style={{ borderColor: t.hairline, backgroundColor: t.wellBg, color: t.ink }}
        >
          <Printer className="h-3.5 w-3.5" style={{ color: t.accentSoft }} />
          <span>Download print file (.stl)</span>
        </button>
      </div>
    </div>
  );
}
