'use client';

import React from 'react';
import { Layers, Eye, EyeOff, Trash2, Box, Cylinder, CircleDot, Donut } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';

export default function CADTree() {
  const nodes = useCADStore((s) => s.nodes);
  const selectedId = useCADStore((s) => s.selectedId);
  const setSelectedId = useCADStore((s) => s.setSelectedId);
  const updateNode = useCADStore((s) => s.updateNode);
  const removeNode = useCADStore((s) => s.removeNode);

  const getIcon = (type: string) => {
    switch (type) {
      case 'box':
        return <Box className="w-3.5 h-3.5 text-cyan-400" />;
      case 'cylinder':
        return <Cylinder className="w-3.5 h-3.5 text-blue-400" />;
      case 'sphere':
        return <CircleDot className="w-3.5 h-3.5 text-indigo-400" />;
      case 'torus':
        return <Donut className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Box className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="w-64 bg-[#101216]/95 backdrop-blur-md border border-[#232733] rounded-xl p-3 text-slate-300 text-xs shadow-2xl flex flex-col font-mono select-none max-h-[50vh] overflow-hidden">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232733] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Scene Hierarchy</span>
        </div>
        <span className="text-[10px] bg-[#161a22] px-1.5 py-0.5 rounded border border-[#272d3b] text-cyan-400">
          {nodes.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {nodes.map((node) => {
          const isSelected = selectedId === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedId(node.id)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'bg-[#14171e]/70 border-transparent hover:bg-slate-800/60 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getIcon(node.type)}
                <span className="truncate">{node.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateNode(node.id, { visible: !node.visible });
                  }}
                  className="hover:text-white"
                >
                  {node.visible ? (
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                  className="hover:text-red-400 text-slate-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {nodes.length === 0 && (
          <p className="text-slate-600 text-center py-4 italic text-[11px]">
            No objects in scene.
          </p>
        )}
      </div>
    </div>
  );
}
