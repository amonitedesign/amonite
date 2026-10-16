'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/navbar';
import {
  Keyboard,
  Compass,
  FileCode,
  Shield,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export default function DocsPage() {
  const shortcuts = [
    { key: 'V', desc: 'Select Tool (Click geometry to focus)' },
    { key: 'G', desc: 'Grab / Translate Gizmo (Move along axes)' },
    { key: 'R', desc: 'Rotate Gizmo (15° increment snap)' },
    { key: 'S', desc: 'Scale Gizmo (Uniform or dimensional scaling)' },
    { key: 'Ctrl + Z', desc: 'Undo previous geometric modification' },
    { key: 'Ctrl + Y', desc: 'Redo undone action' },
    { key: 'Ctrl + D', desc: 'Duplicate selected entity with offset' },
    { key: 'Delete', desc: 'Delete active selected object' },
    { key: 'P', desc: 'Toggle 2D drafting overlay (XZ polygon)' },
    { key: 'Enter', desc: 'Commit draft polygon as extruded solid' },
    { key: 'Esc', desc: 'Clear measurement / close drafting' },
  ];

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-200 font-mono flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Docs Header */}
        <div className="border-b border-[#1c222e] pb-8 mb-10">
          <div className="flex items-center gap-2 text-xs text-cyan-400 uppercase font-bold mb-2">
            <Terminal className="w-4 h-4" />
            <span>Technical Documentation // v0.1 Core</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Amonite CAD Architecture & Reference
          </h1>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">
            Complete technical specification for the Amonite browser CAD/CAM micro-SaaS workspace.
            Client-side WebGL calculations, coordinate systems, hotkeys, and vector interchange formats.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/sandbox"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <span>Launch Studio Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section 1: Keyboard Shortcuts */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-base font-bold text-white mb-4">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2>Interactive Viewport Hotkeys</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-3 rounded-xl border border-[#1f2635] bg-[#0e1118]"
              >
                <span className="text-xs text-slate-400">{s.desc}</span>
                <kbd className="px-2 py-1 rounded bg-[#161c28] border border-[#2d374d] text-cyan-300 text-xs font-bold shadow-sm">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Mathematical Coordinates & Units */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-base font-bold text-white mb-4">
            <Compass className="w-5 h-5 text-blue-400" />
            <h2>Coordinate Frame & Units</h2>
          </div>
          <div className="p-5 rounded-xl border border-[#1f2635] bg-[#0e1118] text-xs leading-relaxed space-y-3 text-slate-300">
            <p>
              Amonite operates on a standard <strong>Right-Handed Cartesian 3D Coordinate System</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>
                <strong className="text-red-400">X-Axis (Red):</strong> Lateral width vector (East / West).
              </li>
              <li>
                <strong className="text-green-400">Y-Axis (Green):</strong> Elevation height vector (Up / Down).
              </li>
              <li>
                <strong className="text-blue-400">Z-Axis (Blue):</strong> Longitudinal depth vector (North / South).
              </li>
            </ul>
            <p className="pt-2 text-slate-400">
              Default system linear units are <strong>Millimeters (mm)</strong> with adaptive fractional grid snapping (1mm, 5mm, 10mm, 25mm steps). All vector transformations and matrix multiplications execute client-side utilizing native hardware GPU acceleration.
            </p>
          </div>
        </section>

        {/* Section 3: File Format Specifications */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-base font-bold text-white mb-4">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h2>Supported File Formats</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#1f2635] bg-[#0e1118] space-y-2">
              <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
                <span>.STL (Stereolithography)</span>
              </h3>
              <p className="text-slate-400">
                Exports industry-standard binary and ASCII triangle meshes directly for 3D slicers (Bambu Studio, Cura, PrusaSlicer, OrcaSlicer) and CNC toolpath generators.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#1f2635] bg-[#0e1118] space-y-2">
              <h3 className="font-bold text-blue-300 flex items-center gap-1.5">
                <span>.DXF (Drawing Exchange Format)</span>
              </h3>
              <p className="text-slate-400">
                AutoCAD R12 ASCII DXF standard for 2D drafting, laser cutters, waterjets, and wire-EDM machines. Supports import into 3D polygon extrusions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#1f2635] bg-[#0e1118] space-y-2">
              <h3 className="font-bold text-sky-300 flex items-center gap-1.5">
                <span>.SVG (Scalable Vector Graphics)</span>
              </h3>
              <p className="text-slate-400">
                High-contrast 2D orthographic vector diagrams with dimension grids. Imports 2D SVG paths and converts them into parametric extruded solids.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#1f2635] bg-[#0e1118] space-y-2">
              <h3 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>.AMONITE.JSON (Project State)</span>
              </h3>
              <p className="text-slate-400">
                Lossless native JSON format capturing the scene tree, dimensions, material colors, camera matrices, and viewport configuration.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Public Repo Segregation Notice */}
        <section className="p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
            <Shield className="w-4 h-4" />
            <span>Architecture & Privacy Segregation</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            This public repository contains the lightweight client-side engine and zero-auth sandbox.
            No personal telemetry or telemetry cookies are stored. For technical support, custom CAM integration inquiries, or enterprise waitlist requests, reach out directly to{' '}
            <a
              href="mailto:amoniteadmin@gmail.com"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              amoniteadmin@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
