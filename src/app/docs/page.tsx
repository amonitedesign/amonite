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
  Box,
} from 'lucide-react';

export default function DocsPage() {
  const shortcuts = [
    { key: 'Drag', desc: 'Orbit around the vessel on its pedestal' },
    { key: 'Scroll', desc: 'Zoom toward / away from the piece' },
    { key: 'Right-drag', desc: 'Pan across the studio stage' },
    { key: 'Reset view', desc: 'Re-center the vessel (bottom bar button)' },
    { key: 'Sliders', desc: 'Shape radius, height, walls, ribs, wave, twist live' },
    { key: 'Ctrl + Z', desc: 'Undo the last shape change' },
    { key: 'Ctrl + Y', desc: 'Redo the undone shape change' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#08090c] text-zinc-900 dark:text-zinc-300 font-mono flex flex-col selection:bg-zinc-700 selection:text-white transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        
        {/* Editorial Docs Header */}
        <div className="border-b border-zinc-200 dark:border-white/[0.06] pb-10 mb-12">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>TECHNICAL SPECIFICATION // V0.1 CORE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Amonite CAD Architecture & Reference
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-3 max-w-3xl leading-relaxed">
            Engineering documentation and formal specification for the Amonite browser atelier. Covers client-side WebGL calculations, coordinate frames, hotkey registries, watertight solid generation, and vector interchange formats.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link
              href="/sandbox"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-bold text-xs transition-colors"
            >
              <span>Launch Studio Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Two-Column Editorial Manual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Sticky Index Menu */}
          <aside className="lg:col-span-3 sticky top-24 hidden lg:block space-y-2 text-xs border-r border-zinc-200 dark:border-white/[0.06] pr-6">
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold mb-3">
              TABLE OF CONTENTS
            </div>
            <nav className="flex flex-col space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <a href="#shortcuts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                1. Viewport Hotkey Registry
              </a>
              <a href="#coordinates" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                2. Coordinate Frame & Units
              </a>
              <a href="#geometry" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                3. Parametric Solid Lifecycle
              </a>
              <a href="#formats" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                4. File Format Specifications
              </a>
              <a href="#security" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                5. Privacy Invariant
              </a>
            </nav>
          </aside>

          {/* Right Column: Deep Technical Content */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* Section 1: Keyboard Shortcuts */}
            <section id="shortcuts" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white mb-4">
                <Keyboard className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h2>Interactive Viewport Hotkeys</h2>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                Standard single-key and modifier-bound bindings for rapid modeling, camera orbit, and gizmo state transformations.
              </p>

              <div className="rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0c0d12] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-white/[0.06] text-[10px] text-zinc-500 uppercase tracking-wider bg-zinc-100/50 dark:bg-white/[0.02]">
                      <th className="py-2.5 px-4 font-semibold">Key Binding</th>
                      <th className="py-2.5 px-4 font-semibold">Command Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-white/[0.04]">
                    {shortcuts.map((s) => (
                      <tr key={s.key} className="hover:bg-zinc-100/40 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <kbd className="px-2 py-1 rounded bg-white dark:bg-[#151720] border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-zinc-200 text-xs font-semibold">
                            {s.key}
                          </kbd>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300 text-xs">
                          {s.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 2: Mathematical Coordinates & Units */}
            <section id="coordinates" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white mb-4">
                <Compass className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h2>Coordinate Frame & Units</h2>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0c0d12] text-xs leading-relaxed space-y-4 text-zinc-800 dark:text-zinc-300">
                <p>
                  Amonite operates strictly on a normalized <strong>Right-Handed Cartesian 3D Coordinate System</strong> conforming to ISO 841 machine coordinate standards:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-lg bg-white dark:bg-[#07080b] border border-zinc-200 dark:border-white/[0.04]">
                    <div className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">X-AXIS (RED)</div>
                    <div className="text-xs text-zinc-900 dark:text-zinc-300 font-medium mt-1">Lateral Width</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Horizontal lateral translation vector</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-white dark:bg-[#07080b] border border-zinc-200 dark:border-white/[0.04]">
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Y-AXIS (GREEN)</div>
                    <div className="text-xs text-zinc-900 dark:text-zinc-300 font-medium mt-1">Elevation Height</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Vertical normal translation vector</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-white dark:bg-[#07080b] border border-zinc-200 dark:border-white/[0.04]">
                    <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">Z-AXIS (BLUE)</div>
                    <div className="text-xs text-zinc-900 dark:text-zinc-300 font-medium mt-1">Longitudinal Depth</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Depth normal translation vector</div>
                  </div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs pt-2">
                  Linear units default to <strong>Millimeters (mm)</strong> with discrete grid snapping options (1mm, 5mm, 10mm, 25mm). Rotations snap to 15° increments when holding Shift or during active transform lock.
                </p>
              </div>
            </section>

            {/* Section 3: Parametric Solid Lifecycle */}
            <section id="geometry" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white mb-4">
                <Box className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h2>Parametric Solid Lifecycle</h2>
              </div>
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0c0d12] text-xs leading-relaxed space-y-4 text-zinc-800 dark:text-zinc-300">
                <p>
                  Every primitive in Amonite is represented as a pure parametric definition in the decoupled Zustand store, evaluated on-the-fly into indexed triangle geometry:
                </p>
                <div className="p-4 rounded-lg bg-white dark:bg-[#07080b] border border-zinc-200 dark:border-white/[0.04] text-[11px] font-mono text-zinc-700 dark:text-zinc-400 space-y-1">
                  <div>interface CADNode &#123;</div>
                  <div className="pl-4">id: string;</div>
                  <div className="pl-4">type: &apos;box&apos; | &apos;cylinder&apos; | &apos;sphere&apos; | &apos;torus&apos; | &apos;cone&apos; | &apos;extrusion&apos;;</div>
                  <div className="pl-4">dimensions: Record&lt;string, number&gt;;</div>
                  <div className="pl-4">transform: &#123; position: [x,y,z]; rotation: [rx,ry,rz]; scale: [sx,sy,sz] &#125;;</div>
                  <div>&#125;</div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                  Whenever dimensional parameters are modified in the inspector, previous GPU vertex attributes and edge buffers are explicitly disposed via <code className="text-zinc-900 dark:text-zinc-200 font-semibold">geometry.dispose()</code> to prevent browser memory leaks.
                </p>
              </div>
            </section>

            {/* Section 4: File Format Specifications */}
            <section id="formats" className="scroll-mt-24">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-white mb-2">
                <FileCode className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h2>Supported File Formats</h2>
              </div>
              <div>
                {[
                  {
                    index: 'F.01',
                    title: '.STL — Stereolithography',
                    body: 'Exports industry-standard packed binary (50-byte IEEE 754 facet records) and ASCII triangle meshes directly compatible with Bambu Studio, Cura, PrusaSlicer, and OrcaSlicer.',
                  },
                  {
                    index: 'F.02',
                    title: '.DXF — Drawing Exchange Format',
                    body: 'AutoCAD R12 ASCII DXF standard for 2D drafting, laser cutters, waterjets, and wire-EDM machines. Also supports importing DXF lines and polyline entities into 3D extrusions.',
                  },
                  {
                    index: 'F.03',
                    title: '.SVG — Scalable Vector Graphics',
                    body: '2D orthographic vector projections. Also parses planar SVG path contours (M, L, H, V, C, Z) into parametric extruded 3D solids.',
                  },
                  {
                    index: 'F.04',
                    title: '.AMONITE.JSON — Project State',
                    body: 'Lossless native project schema version 1.0.0 capturing the full node hierarchy, dimensional parameters, transform vectors, camera projection matrices, and timestamps.',
                  },
                ].map((f) => (
                  <article
                    key={f.index}
                    className="grid grid-cols-12 gap-3 py-5 border-t border-zinc-200 dark:border-white/[0.06] last:border-b"
                  >
                    <span className="col-span-3 sm:col-span-2 font-mono text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                      {f.index}
                    </span>
                    <h3 className="col-span-9 sm:col-span-4 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {f.title}
                    </h3>
                    <p className="col-span-9 col-start-4 sm:col-span-6 sm:col-start-auto text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      {f.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 5: Architecture & Privacy Segregation */}
            <section id="security" className="scroll-mt-24 p-6 rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0c0d12] text-xs">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-bold mb-2">
                <Shield className="w-4 h-4 text-zinc-700 dark:text-zinc-400" />
                <span>Architecture & Privacy Segregation</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                This repository contains the lightweight client-side CAD engine and zero-auth playground. No telemetry tracking, analytics cookies, or cloud databases are attached. For enterprise inquiries, feature requests, or community discussions, please reach out via our GitHub repository.
              </p>
              <div className="mt-3">
                <a
                  href="https://github.com/jhaabhijeet864/amonite/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 dark:text-zinc-200 font-semibold underline hover:text-black dark:hover:text-white"
                >
                  GitHub Issues &rarr;
                </a>
              </div>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
}
