'use client';

import React, { useEffect, useRef } from 'react';
import { PenTool, X, Check, Eraser } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { snapDraftPoint, validatePolygon, polygonArea } from '@/lib/drafting-utils';
import { formatLength } from '@/lib/measurement';

const W = 360;
const H = 260;
const SCALE = 1.2; // px per mm

function toScreen(x: number, y: number): { sx: number; sy: number } {
  return { sx: W / 2 + x * SCALE, sy: H / 2 + y * SCALE };
}

function toWorld(sx: number, sy: number): { x: number; y: number } {
  return { x: (sx - W / 2) / SCALE, y: (sy - H / 2) / SCALE };
}

export default function CADDraftingOverlay(): React.JSX.Element | null {
  const draftingActive = useCADStore((s) => s.draftingActive);
  const draftPoints = useCADStore((s) => s.draftPoints);
  const nodes = useCADStore((s) => s.nodes);
  const viewport = useCADStore((s) => s.viewport);
  const setDraftPoints = useCADStore((s) => s.setDraftPoints);
  const setDraftingActive = useCADStore((s) => s.setDraftingActive);
  const commitDraftAsExtrusion = useCADStore((s) => s.commitDraftAsExtrusion);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !draftingActive) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b0e13';
    ctx.fillRect(0, 0, W, H);

    // Grid
    const stepPx = Math.max(8, viewport.snapStep * SCALE);
    ctx.strokeStyle = 'rgba(148,163,184,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = (W / 2) % stepPx; x < W; x += stepPx) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = (H / 2) % stepPx; y < H; y += stepPx) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = 'rgba(59,130,246,0.6)';
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();

    // Reference ghosts: top-view XZ projection of visible nodes
    ctx.strokeStyle = 'rgba(0,229,255,0.25)';
    nodes.forEach((n) => {
      if (!n.visible) return;
      const { sx, sy } = toScreen(n.position.x, n.position.z);
      if (n.type === 'box') {
        const w = (n.dimensions.width ?? 40) * SCALE;
        const d = (n.dimensions.depth ?? 40) * SCALE;
        ctx.strokeRect(sx - w / 2, sy - d / 2, w, d);
      } else if (n.dimensions.radius) {
        ctx.beginPath();
        ctx.arc(sx, sy, n.dimensions.radius * SCALE, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(sx - 6, sy - 6, 12, 12);
      }
    });

    // Draft polyline
    if (draftPoints.length > 0) {
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      draftPoints.forEach((p, i) => {
        const { sx, sy } = toScreen(p.x, p.y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      draftPoints.forEach((p) => {
        const { sx, sy } = toScreen(p.x, p.y);
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [draftingActive, draftPoints, nodes, viewport.snapStep]);

  if (!draftingActive) return null;

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const raw = toWorld(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    const snapped = snapDraftPoint(raw, viewport.snapStep, viewport.snapToGrid);
    setDraftPoints([...draftPoints, snapped]);
  };

  const validation = validatePolygon(draftPoints);
  const area = polygonArea(draftPoints);

  const loadSelected = () => {
    const sel = nodes.find((n) => n.id === useCADStore.getState().selectedId);
    if (sel?.extrusionPoints && sel.extrusionPoints.length >= 3) {
      setDraftPoints(sel.extrusionPoints.map((p) => ({ x: p.x, y: p.y })));
    }
  };

  return (
    <div className="w-[392px] rounded-xl border border-cyan-500/30 bg-[#101216]/95 p-3 font-mono text-xs text-slate-300 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-[#232733] pb-2">
        <span className="flex items-center gap-1.5 font-bold text-cyan-300">
          <PenTool className="h-3.5 w-3.5" /> 2D DRAFTING (XZ)
        </span>
        <button
          onClick={() => {
            setDraftPoints([]);
            setDraftingActive(false);
          }}
          className="text-slate-500 hover:text-white"
          title="Close drafting (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        className="mt-2 w-full cursor-crosshair rounded-lg border border-[#272d3b]"
      />
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {draftPoints.length} pts · area {formatLength(area, viewport.unit === 'mm' ? 'mm' : 'in', 1)}
          {validation.ok ? '' : ` — ${validation.reason ?? ''}`}
        </span>
        <span>snap {viewport.snapStep}mm</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <button
          onClick={loadSelected}
          className="rounded-md border border-[#272d3b] bg-[#161a22] px-2 py-1.5 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          Edit selected
        </button>
        <button
          onClick={() => setDraftPoints([])}
          className="flex items-center justify-center gap-1 rounded-md border border-[#272d3b] bg-[#161a22] px-2 py-1.5 hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <Eraser className="h-3 w-3" /> Clear
        </button>
        <button
          onClick={() => commitDraftAsExtrusion()}
          disabled={!validation.ok}
          className="flex items-center justify-center gap-1 rounded-md bg-cyan-500 px-2 py-1.5 font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="h-3 w-3" /> Extrude
        </button>
      </div>
    </div>
  );
}
