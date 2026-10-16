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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#1c1712] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 p-6 font-mono text-[#ece5d8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c96f4b]/15 border border-[#c96f4b]/30 flex items-center justify-center text-[#d98f66]">
              <FileBox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Atelier Project & Export
              </h3>
              <p className="text-[11px] text-[#a89e8d]">
                100% Client-Side Watertight STL Meshes & Vessel Project Vault
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#a89e8d] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-white/[0.07] mt-4 mb-5 text-xs">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-[#c96f4b] text-white'
                : 'border-transparent text-[#8e8476] hover:text-[#ece5d8]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#c96f4b]" />
            Export Geometry
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2 px-4 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-[#c96f4b] text-white'
                : 'border-transparent text-[#8e8476] hover:text-[#ece5d8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#c96f4b]" />
            Import Files
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => handleExportSTL(true)}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-white/[0.07] bg-[#241e18] hover:border-[#c96f4b]/50 hover:bg-[#2c241c] transition-all text-left group"
            >
              <div className="flex items-center gap-2 text-[#d98f66] font-bold group-hover:text-white">
                <FileBox className="w-4 h-4 text-[#c96f4b]" />
                <span>STL Binary</span>
              </div>
              <p className="text-[11px] text-[#a89e8d] leading-snug">
                Watertight 3D mesh for clay &amp; FDM slicers (Bambu Studio, PrusaSlicer, Cura).
              </p>
            </button>

            <button
              onClick={handleExportDXF}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-white/[0.07] bg-[#241e18] hover:border-[#c96f4b]/50 hover:bg-[#2c241c] transition-all text-left group"
            >
              <div className="flex items-center gap-2 text-[#d98f66] font-bold group-hover:text-white">
                <FileCode className="w-4 h-4 text-[#c28456]" />
                <span>AutoCAD DXF</span>
              </div>
              <p className="text-[11px] text-[#a89e8d] leading-snug">
                2D profile cross-section &amp; elevation vector for studio spec sheets.
              </p>
            </button>

            <button
              onClick={handleExportSVG}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-white/[0.07] bg-[#241e18] hover:border-[#c96f4b]/50 hover:bg-[#2c241c] transition-all text-left group"
            >
              <div className="flex items-center gap-2 text-[#d98f66] font-bold group-hover:text-white">
                <Layers className="w-4 h-4 text-[#d4a373]" />
                <span>SVG Vector</span>
              </div>
              <p className="text-[11px] text-[#a89e8d] leading-snug">
                Clean 2D vector silhouette graphic for design lookbooks and laser templates.
              </p>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-white/[0.07] bg-[#241e18] hover:border-[#c96f4b]/50 hover:bg-[#2c241c] transition-all text-left group"
            >
              <div className="flex items-center gap-2 text-[#d98f66] font-bold group-hover:text-white">
                <FileText className="w-4 h-4 text-[#68b684]" />
                <span>Amonite JSON</span>
              </div>
              <p className="text-[11px] text-[#a89e8d] leading-snug">
                Full project backup (.amonite.json) preserving vessel shape, ribs, and glazes.
              </p>
            </button>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/[0.12] rounded-xl bg-[#161310]/60 text-center">
            <Upload className="w-8 h-8 text-[#c96f4b] mb-2" />
            <p className="text-xs font-semibold text-white mb-1">
              Select or Drop DXF, SVG, or JSON Project File
            </p>
            <p className="text-[11px] text-[#a89e8d] mb-4 max-w-xs leading-relaxed">
              Restores your clay vessel and dimensions instantly in browser memory without sending data to any server.
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
              className="px-4 py-2 rounded-lg bg-[#c96f4b] hover:bg-[#b86240] text-white font-medium text-xs transition-colors"
            >
              Choose Local File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
