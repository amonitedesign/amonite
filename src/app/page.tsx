'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Maximize2,
  Terminal,
  Cpu,
  Shield,
  Box,
} from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import CADCanvas from '@/components/cad/cad-canvas';
import CADToolbar from '@/components/cad/cad-toolbar';
import CADViewControls from '@/components/cad/cad-view-controls';
import WaitlistModal from '@/components/landing/waitlist-modal';
import FileDialog from '@/components/io/file-dialog';

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isFileExchangeOpen, setIsFileExchangeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090b] text-slate-300 font-mono flex flex-col selection:bg-cyan-300 selection:text-black">
      <Navbar
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
        onOpenFileExchange={() => setIsFileExchangeOpen(true)}
      />

      {/* Asymmetric Split Industrial Hero Section */}
      <section className="relative w-full pt-12 sm:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Left-Anchored Typographic Lockup with Technical Metadata */}
          <div className="lg:col-span-5 flex flex-col items-start pt-2">
            
            {/* Industrial Eyebrow Tag: Mono Uppercase Tracking-Widest, No Pill Glow */}
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>ENGINE: CLIENT WEBGL 2.0 // DIRECT BREP</span>
            </div>

            {/* Asymmetric Headline with font-display */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-left">
              Precision Engineering in Your Browser.
            </h1>

            {/* Structured Technical Subtext */}
            <p className="mt-6 text-slate-400 text-xs sm:text-sm leading-relaxed text-left max-w-lg">
              Hardware-accelerated 3D solid modeling, 2D vector drafting, client-side trigonometry, and instant STL/DXF compilation. Zero external databases, zero authentication gates, zero cloud latency.
            </p>

            {/* Engineering Metrics Matrix */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md pt-6 border-t border-white/[0.08]">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">TOLERANCE</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">±0.001 mm</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">COORDINATES</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">Right-Handed X/Y/Z</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">EXPORT LATENCY</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">&lt; 15 ms (Client)</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">EGRESS AUDIT</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">0 bytes network</div>
              </div>
            </div>

            {/* Action Triggers: Primary Solid Cyan-300 + Secondary Bordered */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full">
              <Link
                href="/sandbox"
                className="px-5 py-2.5 rounded-lg bg-cyan-300 hover:bg-cyan-200 text-black font-semibold transition-colors flex items-center gap-2 text-xs"
              >
                <span>Open Studio Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-[#101216] text-slate-200 transition-colors text-xs font-semibold"
              >
                Join Pro Waitlist
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Hardware-Accelerated 3D WebGL Viewport */}
          <div className="lg:col-span-7 w-full">
            <div className="w-full rounded-xl border border-white/[0.08] bg-[#0a0b0e] overflow-hidden relative">
              
              {/* Studio Telemetry Bar */}
              <div className="h-9 bg-[#101216] border-b border-white/[0.08] px-3.5 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="font-semibold text-slate-300">Live WebGL Viewport</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 hidden sm:inline">120 FPS // Raycast Active</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[10px] hidden md:inline">
                    L-Click: Orbit &middot; R-Click: Pan &middot; Wheel: Zoom
                  </span>
                  <Link
                    href="/sandbox"
                    className="flex items-center gap-1 text-slate-300 hover:text-white font-medium"
                    title="Open Sandbox Studio"
                  >
                    <span>Full Studio</span>
                    <Maximize2 className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* WebGL Canvas Container */}
              <div className="relative w-full h-[460px] sm:h-[520px]">
                <CADCanvas />

                {/* Overlaid Minimal Toolbar */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 scale-90 sm:scale-100">
                  <CADToolbar />
                </div>

                {/* Overlaid View Controls HUD */}
                <div className="absolute bottom-3 left-3 z-10 scale-90 sm:scale-100">
                  <CADViewControls />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Asymmetric Technical Specification Bento Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-white/[0.08]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-widest mb-2">
              01 // TECHNICAL ARCHITECTURE
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hardware-Accelerated Client Solids
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Engineered from first principles with direct Three.js buffers, memory disposal lifecycles, and byte-level CAD/CAM vector serialization.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tile 1: Primary Wide Tile (8 cols) - 3D Brep Kernel & Transform Gizmos */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-xl bg-[#0d0f13] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-white/[0.08]">
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-slate-300" />
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">KERNEL SPECIFICATION</span>
                </span>
                <span className="font-mono text-[10px]">ZUSTAND &middot; THREE.JS RAYCAST</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight font-display">
                Parametric Solid Primitives & Instant Memory Disposal
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                Real-time geometric generation for Cuboids, Cylinders, Spheres, Tori, Cones, and 2D Extruded Polygons. Whenever dimensions are mutated via the numeric inspector, active WebGL buffers and edge geometries are immediately recycled with explicit memory disposal, completely preventing VRAM leaks.
              </p>
            </div>

            {/* Monospace Code / Spec Callout */}
            <div className="mt-6 p-4 rounded-lg bg-[#161a22] border border-white/[0.04] text-[11px] font-mono text-slate-400 space-y-1 overflow-x-auto">
              <div className="text-slate-500">// Direct WebGL geometry disposal lifecycle</div>
              <div className="text-slate-300">mesh.geometry.dispose(); edges.geometry.dispose();</div>
              <div className="text-slate-500">// Precision Raycasting & Transform gizmos</div>
              <div className="text-slate-300">gizmo.setMode(&apos;translate&apos; | &apos;rotate&apos; | &apos;scale&apos;); gizmo.setTranslationSnap(1.0);</div>
            </div>
          </div>

          {/* Tile 2: Secondary Tall Tile (4 cols) - Vector & Mesh Interchange Matrix */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-xl bg-[#0d0f13] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-white/[0.08]">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-300" />
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">INTERCHANGE MATRIX</span>
                </span>
                <span className="font-mono text-[10px]">CAM READY</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight font-display">
                Lossless Format Pipeline
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Direct in-browser generation of manufacturing files without relying on native compilation backends.
              </p>
            </div>

            <div className="mt-6 space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-[#161a22] border border-white/[0.04]">
                <div className="text-xs font-semibold text-slate-200">Binary STL (Packed 50B)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">80-byte header + uint32 triangle count + IEEE 754 float32 records</div>
              </div>
              <div className="p-3 rounded-lg bg-[#161a22] border border-white/[0.04]">
                <div className="text-xs font-semibold text-slate-200">AutoCAD DXF (R12 ASCII)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Line-by-line entity streamer for CNC laser cutters & wire EDMs</div>
              </div>
              <div className="p-3 rounded-lg bg-[#161a22] border border-white/[0.04]">
                <div className="text-xs font-semibold text-slate-200">SVG 2D Path Extrusion</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Planar contour triangulation into volumetric 3D solids</div>
              </div>
            </div>
          </div>

          {/* Tile 3: Full-Width Asymmetric Invariant Tile (12 cols) - Zero-Egress Privacy */}
          <div className="lg:col-span-12 p-6 sm:p-8 rounded-xl bg-[#0d0f13] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-slate-300" />
                <span className="font-semibold text-slate-300 uppercase tracking-widest text-[11px] font-mono">
                  02 // CLIENT SECURITY INVARIANT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                Zero-Auth, Zero-Tracking, Zero-Egress Storage
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No user accounts, tracking cookies, or remote server synchronization. All models, coordinate transformations, and history snapshots persist strictly in your browser&apos;s private local storage.
              </p>
            </div>

            <Link
              href="/sandbox"
              className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-[#101216] text-slate-200 transition-colors text-xs font-semibold whitespace-nowrap"
            >
              Verify In Sandbox
            </Link>
          </div>

        </div>
      </section>

      {/* Early Access Action Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0d0f13] border border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
              03 // AMONITE PRO QUEUE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
              Looking for 5-Axis CAM Toolpaths & Generative Meshing?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We are expanding the Amonite engine with cloud revision vaulting, STEP/IGES Brep kernels, and multi-axis CNC toolpath post-processors. Direct engineering queue managed at <span className="text-slate-200">amoniteadmin@gmail.com</span>.
            </p>
          </div>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="px-6 py-3 rounded-lg bg-cyan-300 hover:bg-cyan-200 text-black font-semibold text-xs transition-colors whitespace-nowrap"
          >
            Request Early Access
          </button>
        </div>
      </section>

      {/* Monochromatic Technical Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#060709] py-10 px-4 sm:px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center p-1">
              <Image
                src="/logo-mark.svg"
                alt="Amonite Logo"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-slate-300 font-bold">AMONITE CAD</span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-400">Public Foundational Micro-SaaS</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/sandbox" className="hover:text-slate-300 transition-colors">
              Studio Sandbox
            </Link>
            <Link href="/docs" className="hover:text-slate-300 transition-colors">
              Technical Documentation
            </Link>
            <a
              href="https://github.com/jhaabhijeet864/amonite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="mailto:amoniteadmin@gmail.com"
              className="hover:text-slate-300 transition-colors"
            >
              amoniteadmin@gmail.com
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <FileDialog isOpen={isFileExchangeOpen} onClose={() => setIsFileExchangeOpen(false)} />
    </div>
  );
}
