'use client';

import React from 'react';
import {
  MousePointer,
  Move,
  RotateCw,
  Maximize2,
  Box,
  Cylinder,
  CircleDot,
  Donut,
  Layers,
  Undo2,
  Redo2,
  Trash2,
  Copy,
} from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { TransformMode, PrimitiveType } from '@/lib/cad-types';

export default function CADToolbar() {
  const transformMode = useCADStore((s) => s.transformMode);
  const selectedId = useCADStore((s) => s.selectedId);
  const undoStack = useCADStore((s) => s.undoStack);
  const redoStack = useCADStore((s) => s.redoStack);

  const setTransformMode = useCADStore((s) => s.setTransformMode);
  const addNode = useCADStore((s) => s.addNode);
  const removeNode = useCADStore((s) => s.removeNode);
  const duplicateNode = useCADStore((s) => s.duplicateNode);
  const undo = useCADStore((s) => s.undo);
  const redo = useCADStore((s) => s.redo);

  const modes: { id: TransformMode; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Select (V)', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'translate', label: 'Move (G)', icon: <Move className="w-4 h-4" /> },
    { id: 'rotate', label: 'Rotate (R)', icon: <RotateCw className="w-4 h-4" /> },
    { id: 'scale', label: 'Scale (S)', icon: <Maximize2 className="w-4 h-4" /> },
  ];

  const primitives: { type: PrimitiveType; label: string; icon: React.ReactNode }[] = [
    { type: 'box', label: 'Cuboid', icon: <Box className="w-4 h-4" /> },
    { type: 'cylinder', label: 'Cylinder', icon: <Cylinder className="w-4 h-4" /> },
    { type: 'sphere', label: 'Sphere', icon: <CircleDot className="w-4 h-4" /> },
    { type: 'torus', label: 'Torus', icon: <Donut className="w-4 h-4" /> },
    { type: 'extrusion', label: '2D Extrude', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#101216]/90 backdrop-blur-md border border-[#232733] rounded-xl shadow-2xl text-slate-300">
      {/* Transformation Modes */}
      <div className="flex items-center gap-1 bg-[#161a22] p-1 rounded-lg border border-[#272d3b]">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setTransformMode(m.id)}
            title={m.label}
            className={`p-2 rounded-md transition-all flex items-center justify-center ${
              transformMode === m.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
            }`}
          >
            {m.icon}
          </button>
        ))}
      </div>

      <div className="w-[1px] h-6 bg-[#272d3b] mx-1" />

      {/* Primitives Generator */}
      <div className="flex items-center gap-1 bg-[#161a22] p-1 rounded-lg border border-[#272d3b]">
        {primitives.map((p) => (
          <button
            key={p.type}
            onClick={() => addNode(p.type)}
            title={`Add ${p.label}`}
            className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-medium"
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="w-[1px] h-6 bg-[#272d3b] mx-1" />

      {/* History & Selected Operations */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg border border-[#272d3b] bg-[#161a22] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-400 hover:text-slate-100"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded-lg border border-[#272d3b] bg-[#161a22] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-400 hover:text-slate-100"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {selectedId && (
          <>
            <button
              onClick={() => duplicateNode(selectedId)}
              title="Duplicate (Ctrl+D)"
              className="p-2 rounded-lg border border-[#272d3b] bg-[#161a22] hover:bg-slate-800 transition-colors text-slate-400 hover:text-cyan-300"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeNode(selectedId)}
              title="Delete (Del)"
              className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
