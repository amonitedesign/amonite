'use client';

import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  FileCode,
  FileBox,
  Layers,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { exportToSTL } from '@/lib/parsers/stl-exporter';
import { exportToDXF, parseDXF } from '@/lib/parsers/dxf-parser';
import { exportToSVG, parseSVGPaths } from '@/lib/parsers/svg-parser';
import {
  createProjectJSON,
  parseProjectJSON,
  downloadBlob,
} from '@/lib/parsers/project-io';

interface FileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileDialog({ isOpen, onClose }: FileDialogProps) {
  const nodes = useCADStore((s) => s.nodes);
  const viewport = useCADStore((s) => s.viewport);
  const loadProject = useCADStore((s) => s.loadProject);
  const addNode = useCADStore((s) => s.addNode);
  const updateNode = useCADStore((s) => s.updateNode);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExportSTL = (isBinary = true) => {
    const blob = exportToSTL(nodes, isBinary);
    downloadBlob(blob, `amonite_model_${Date.now()}.${isBinary ? 'stl' : 'ascii.stl'}`);
    triggerSuccess('Exported STL mesh file');
  };

  const handleExportDXF = () => {
    const blob = exportToDXF(nodes);
    downloadBlob(blob, `amonite_cad_${Date.now()}.dxf`);
    triggerSuccess('Exported DXF vector file');
  };

  const handleExportSVG = () => {
    const blob = exportToSVG(nodes);
    downloadBlob(blob, `amonite_diagram_${Date.now()}.svg`);
    triggerSuccess('Exported SVG 2D projection');
  };

  const handleExportJSON = () => {
    const blob = createProjectJSON(nodes, viewport, 'Amonite Studio Project');
    downloadBlob(blob, `amonite_project_${Date.now()}.amonite.json`);
    triggerSuccess('Exported Native Amonite Project');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const ext = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      try {
        if (ext === 'json') {
          const proj = parseProjectJSON(content);
          loadProject(proj);
          triggerSuccess('Project successfully restored');
          onClose();
        } else if (ext === 'dxf') {
          const points = parseDXF(content);
          const newNode = addNode('extrusion');
          updateNode(newNode.id, {
            name: `Imported DXF (${file.name})`,
            extrusionPoints: points,
          });
          triggerSuccess('Imported DXF vectors into 3D Extrusion');
          onClose();
        } else if (ext === 'svg') {
          const points = parseSVGPaths(content);
          const newNode = addNode('extrusion');
          updateNode(newNode.id, {
            name: `Imported SVG (${file.name})`,
            extrusionPoints: points,
          });
          triggerSuccess('Imported SVG paths into 3D Extrusion');
          onClose();
        } else {
          alert('Unsupported file format. Please upload .json, .dxf, or .svg');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        alert(`Failed to import file: ${message}`);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#0e1014] border border-[#272d3b] rounded-2xl shadow-2xl p-6 font-mono text-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileBox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                File Exchange Hub
              </h3>
              <p className="text-[11px] text-slate-500">
                100% Client-Side Private CAD Parsers & Exporters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-[#232733] mt-4 mb-5 text-xs">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Geometry
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import Files
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => handleExportSTL(true)}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-[#272d3b] bg-[#14171f] hover:border-cyan-500/40 hover:bg-[#181d28] transition-all text-left"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <FileBox className="w-4 h-4" />
                <span>STL Binary</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Optimized for 3D printing slicers (Cura, PrusaSlicer, Bambu Studio).
              </p>
            </button>

            <button
              onClick={handleExportDXF}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-[#272d3b] bg-[#14171f] hover:border-cyan-500/40 hover:bg-[#181d28] transition-all text-left"
            >
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <FileCode className="w-4 h-4" />
                <span>AutoCAD DXF</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Standard ASCII DXF entities for CNC, laser cutting, and 2D CAD.
              </p>
            </button>

            <button
              onClick={handleExportSVG}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-[#272d3b] bg-[#14171f] hover:border-cyan-500/40 hover:bg-[#181d28] transition-all text-left"
            >
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Layers className="w-4 h-4" />
                <span>SVG Vector</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Top-down 2D orthographic diagram with coordinate grid.
              </p>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-[#272d3b] bg-[#14171f] hover:border-cyan-500/40 hover:bg-[#181d28] transition-all text-left"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <FileText className="w-4 h-4" />
                <span>Amonite JSON</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Lossless full project state with camera, dimensions, and nodes.
              </p>
            </button>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#2b3242] rounded-xl bg-[#14171f]/50 text-center">
            <Upload className="w-8 h-8 text-cyan-400 mb-2" />
            <p className="text-xs font-semibold text-white mb-1">
              Select or Drop DXF, SVG, or JSON Project File
            </p>
            <p className="text-[11px] text-slate-400 mb-4 max-w-xs">
              Parses instantly in your browser memory without uploading to any remote server.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.dxf,.svg"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Choose Local File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
