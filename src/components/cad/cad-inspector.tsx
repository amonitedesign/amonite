'use client';

import React from 'react';
import { Sliders, Eye, EyeOff } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { fromMM, toMM } from '@/lib/measurement';

export default function CADInspector() {
  const selectedId = useCADStore((s) => s.selectedId);
  const nodes = useCADStore((s) => s.nodes);
  const updateNode = useCADStore((s) => s.updateNode);
  const updateNodeTransform = useCADStore((s) => s.updateNodeTransform);
  const unit = useCADStore((s) => s.viewport.unit);

  const selectedNode = nodes.find((n) => n.id === selectedId);

  if (!selectedNode) {
    return (
      <div className="w-72 bg-[#101216]/95 backdrop-blur-md border border-[#232733] rounded-xl p-4 text-slate-400 text-xs shadow-2xl">
        <div className="flex items-center gap-2 pb-3 border-b border-[#232733] text-slate-300 font-semibold uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Properties</span>
        </div>
        <p className="mt-4 text-slate-500 italic">No object selected. Click an object in the viewport or tree to inspect dimensions.</p>
      </div>
    );
  }

  const { position, rotation, dimensions, color, visible, name, type } = selectedNode;

  return (
    <div className="w-72 bg-[#101216]/95 backdrop-blur-md border border-[#232733] rounded-xl p-4 text-slate-300 text-xs shadow-2xl flex flex-col gap-4 font-mono select-none max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#232733]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
            className="bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-xs text-white font-semibold focus:outline-none focus:border-cyan-400 w-32"
          />
        </div>
        <button
          onClick={() => updateNode(selectedNode.id, { visible: !visible })}
          title="Toggle Visibility"
          className="text-slate-400 hover:text-white"
        >
          {visible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      {/* Position (X, Y, Z) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-slate-500 uppercase font-semibold">Position ({unit})</span>
        <div className="grid grid-cols-3 gap-1.5">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="flex items-center bg-[#161a22] border border-[#272d3b] rounded px-1.5 py-1">
              <span className={`text-[10px] font-bold mr-1 ${axis === 'x' ? 'text-red-400' : axis === 'y' ? 'text-green-400' : 'text-blue-400'}`}>
                {axis.toUpperCase()}
              </span>
              <input
                type="number"
                step={unit === 'mm' ? 5 : 0.25}
                value={Number(fromMM(position[axis], unit).toFixed(3))}
                onChange={(e) =>
                  updateNodeTransform(selectedNode.id, { [axis]: toMM(parseFloat(e.target.value) || 0, unit) })
                }
                className="w-full bg-transparent text-right text-xs text-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation (Degrees) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-slate-500 uppercase font-semibold">Rotation (Deg)</span>
        <div className="grid grid-cols-3 gap-1.5">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="flex items-center bg-[#161a22] border border-[#272d3b] rounded px-1.5 py-1">
              <span className="text-[10px] font-bold mr-1 text-slate-500">{axis.toUpperCase()}</span>
              <input
                type="number"
                step="15"
                value={rotation[axis]}
                onChange={(e) =>
                  updateNodeTransform(selectedNode.id, undefined, { [axis]: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-transparent text-right text-xs text-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Parametric Dimensions */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-[#232733]">
        <span className="text-[10px] text-slate-500 uppercase font-semibold">Dimensions ({type})</span>

        {type === 'box' && (
          <div className="flex flex-col gap-2">
            {(['width', 'height', 'depth'] as const).map((dim) => (
              <div key={dim} className="flex items-center justify-between">
                <span className="capitalize text-slate-400">{dim}:</span>
                <input
                  type="number"
                  min="1"
                  value={dimensions[dim] || 40}
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      dimensions: { ...dimensions, [dim]: Math.max(1, parseFloat(e.target.value) || 1) },
                    })
                  }
                  className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            ))}
          </div>
        )}

        {(type === 'cylinder' || type === 'cone') && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Radius:</span>
              <input
                type="number"
                min="1"
                value={dimensions.radius || 20}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    dimensions: { ...dimensions, radius: Math.max(1, parseFloat(e.target.value) || 1) },
                  })
                }
                className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Height:</span>
              <input
                type="number"
                min="1"
                value={dimensions.height || 40}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    dimensions: { ...dimensions, height: Math.max(1, parseFloat(e.target.value) || 1) },
                  })
                }
                className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {type === 'sphere' && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Radius:</span>
            <input
              type="number"
              min="1"
              value={dimensions.radius || 25}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  dimensions: { ...dimensions, radius: Math.max(1, parseFloat(e.target.value) || 1) },
                })
              }
              className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}

        {type === 'torus' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Main Radius:</span>
              <input
                type="number"
                min="1"
                value={dimensions.radius || 25}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    dimensions: { ...dimensions, radius: Math.max(1, parseFloat(e.target.value) || 1) },
                  })
                }
                className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tube Radius:</span>
              <input
                type="number"
                min="1"
                value={dimensions.tube || 8}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    dimensions: { ...dimensions, tube: Math.max(1, parseFloat(e.target.value) || 1) },
                  })
                }
                className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {type === 'extrusion' && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Extrude Depth:</span>
            <input
              type="number"
              min="1"
              value={dimensions.height || 20}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  dimensions: { ...dimensions, height: Math.max(1, parseFloat(e.target.value) || 1) },
                })
              }
              className="w-20 bg-[#161a22] border border-[#272d3b] rounded px-2 py-0.5 text-right text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}
      </div>

      {/* Material & Appearance */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#232733]">
        <span className="text-[10px] text-slate-500 uppercase font-semibold">Material Color</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => updateNode(selectedNode.id, { color: e.target.value })}
            className="w-8 h-8 rounded border border-[#272d3b] bg-transparent cursor-pointer"
          />
          <span className="text-xs uppercase text-slate-400">{color}</span>
        </div>
      </div>
    </div>
  );
}
