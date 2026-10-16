'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Maximize2,
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
    <div className="min-h-screen bg-[#fbfaf7] dark:bg-[#121110] text-[#1c1a17] dark:text-[#dcd8d0] font-mono flex flex-col selection:bg-[#d4a373] selection:text-black transition-colors">
      <Navbar
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
        onOpenFileExchange={() => setIsFileExchangeOpen(true)}
      />

      {/* 3D Minimalist Object Studio Hero — Asymmetric Split with 3D Canvas as Anchor */}
      <section className="relative w-full pt-10 sm:pt-14 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Quiet Gallery Typography & Object Metrics */}
          <div className="lg:col-span-5 flex flex-col items-start pt-2">
            
            {/* Minimal Studio Eyebrow: Quiet Organic Tracking-Widest */}
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#7c756b] dark:text-[#8e877c] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c28456] dark:bg-[#d4a373]" />
              <span>MINIMAL OBJECT STUDIO // VASE &amp; CERAMIC CAD</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#141311] dark:text-[#f2efe9] tracking-tight leading-[1.06] text-left">
              Sculpt minimal 3D objects, right in your browser.
            </h1>

            {/* Quiet Subtext */}
            <p className="mt-5 text-[#5e574d] dark:text-[#a8a194] text-xs sm:text-sm leading-relaxed text-left max-w-md">
              A dedicated digital atelier for crafting bespoke 3D vases, sculptural vessels, and ceramic interior objects. Direct profile curvature, parametric lathe sweeps, and instant watertight STL export for clay &amp; resin 3D printing.
            </p>

            {/* Object Studio Telemetry Specs */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md pt-5 border-t border-[#e6e2da] dark:border-[#262421]">
              <div>
                <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">WALL THICKNESS</div>
                <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">±0.1 mm precision</div>
              </div>
              <div>
                <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">GEOMETRY FORM</div>
                <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">Singular Brep Vessel</div>
              </div>
              <div>
                <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">FABRICATION HANDOFF</div>
                <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">Watertight STL + DXF</div>
              </div>
              <div>
                <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">ATELIER PRIVACY</div>
                <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">0 bytes leave machine</div>
              </div>
            </div>

            {/* Action Triggers: Quiet Gallery Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 w-full">
              <Link
                href="/sandbox"
                className="px-5 py-2.5 rounded-lg bg-[#1a1917] hover:bg-[#2c2a26] text-[#fcfbf9] dark:bg-[#ece8df] dark:hover:bg-[#ffffff] dark:text-[#161513] font-semibold transition-colors flex items-center gap-2 text-xs"
              >
                <span>Open Studio Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="px-5 py-2.5 rounded-lg border border-[#ded9cf] dark:border-[#2d2b27] hover:border-[#b8b1a3] dark:hover:border-[#47433d] bg-transparent text-[#262421] dark:text-[#cfc9be] transition-colors text-xs font-semibold"
              >
                Join Pro Waitlist
              </button>
            </div>
          </div>

          {/* Right Column: 3D Canvas First — The Interactive Anchor of the App */}
          <div className="lg:col-span-7 w-full">
            <div className="w-full rounded-xl border border-[#e3dfd6] dark:border-[#262421] bg-[#f4f1eb] dark:bg-[#181715] overflow-hidden relative shadow-sm">
              
              {/* Quiet Gallery Frame Header */}
              <div className="h-9 bg-[#eae6dc] dark:bg-[#1f1e1b] border-b border-[#e3dfd6] dark:border-[#262421] px-3.5 flex items-center justify-between text-[11px] text-[#70695e] dark:text-[#948c7e]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c28456] dark:bg-[#d4a373]" />
                  <span className="font-semibold text-[#1e1c19] dark:text-[#d6d0c4]">Vessel Geometry // 3D Viewport</span>
                  <span className="text-[#a8a194] dark:text-[#47433d]">|</span>
                  <span className="hidden sm:inline">Singular Object Study</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] hidden md:inline text-[#8a8276] dark:text-[#7a7469]">
                    Drag: Rotate Object &middot; Wheel: Inspect Form
                  </span>
                  <Link
                    href="/sandbox"
                    className="flex items-center gap-1 text-[#1e1c19] dark:text-[#dcd8d0] hover:text-[#c28456] font-medium"
                    title="Open Fullscreen Atelier"
                  >
                    <span>Full Atelier</span>
                    <Maximize2 className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* WebGL Canvas Container */}
              <div className="relative w-full h-[460px] sm:h-[500px]">
                <CADCanvas />

                {/* Quiet Floating Tool HUD */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 scale-90 sm:scale-100 opacity-90 hover:opacity-100 transition-opacity">
                  <CADToolbar />
                </div>

                {/* Quiet Floating View Controls */}
                <div className="absolute bottom-3 left-3 z-10 scale-90 sm:scale-100 opacity-90 hover:opacity-100 transition-opacity">
                  <CADViewControls />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Asymmetric Minimalist Specification Bento Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[#e6e2da] dark:border-[#262421]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-[11px] font-mono font-semibold text-[#857d72] dark:text-[#787166] uppercase tracking-widest mb-2">
              01 // ATELIER METHODOLOGY
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141311] dark:text-[#f2efe9] tracking-tight">
              Crafted for bespoke vessels &amp; ceramics
            </h2>
          </div>
          <p className="text-xs text-[#5e574d] dark:text-[#a8a194] max-w-md leading-relaxed">
            Eliminating architectural clutter to focus purely on curvature, wall thickness, and tactile physical geometry.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tile 1: Primary Wide Tile (8 cols) - Object Morphology & Profile Lathe */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#70695e] dark:text-[#8a8276] mb-4 pb-3 border-b border-[#e3dfd6] dark:border-[#262421]">
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#8f643f] dark:text-[#d4a373]" />
                  <span className="font-semibold text-[#1e1c19] dark:text-[#dcd8d0] uppercase tracking-wider">OBJECT MORPHOLOGY</span>
                </span>
                <span className="font-mono text-[10px]">PARAMETRIC PROFILE &middot; WALL OFFSET</span>
              </div>
              <h3 className="text-lg font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
                Pure singular object geometry without room distractions
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed max-w-2xl">
                Sculpt fluted vases, tapered cylinders, spherical vessel caps, and lofted extrusion forms. Instant numeric wall thickness controls let you calculate clay shrinkage, minimum nozzle extrusion limits, and structural balance before physical fabrication.
              </p>
            </div>

            {/* Monospace Spec Callout */}
            <div className="mt-6 p-4 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622] text-[11px] font-mono text-[#423d35] dark:text-[#c4bdb1] space-y-1 overflow-x-auto">
              <div className="text-[#857d72] dark:text-[#787166]">{'// Ceramic vase profile parameters'}</div>
              <div className="text-[#141311] dark:text-[#ece8df]">vessel radius 65 mm · neck 28 mm · wall 3.2 mm · base chamfer 4 mm</div>
              <div className="text-[#857d72] dark:text-[#787166]">{'// 3D Clay Printing / Slicer export'}</div>
              <div className="text-[#141311] dark:text-[#ece8df]">export watertight-vessel.stl · contour-profile.dxf</div>
            </div>
          </div>

          {/* Tile 2: Secondary Tall Tile (4 cols) - Ceramic & Additive Interchange */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#70695e] dark:text-[#8a8276] mb-4 pb-3 border-b border-[#e3dfd6] dark:border-[#262421]">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8f643f] dark:text-[#d4a373]" />
                  <span className="font-semibold text-[#1e1c19] dark:text-[#dcd8d0] uppercase tracking-wider">FABRICATION PIPELINE</span>
                </span>
                <span className="font-mono text-[10px]">SLICER READY</span>
              </div>
              <h3 className="text-base font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
                Files made for physical makers
              </h3>
              <p className="mt-2 text-xs text-[#5e574d] dark:text-[#a8a194] leading-relaxed">
                Export clean, manifold files designed specifically for clay 3D printers, SLA resin, and wooden lathe turning.
              </p>
            </div>

            <div className="mt-6 space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">Binary STL (Watertight Brep)</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">Packed 50B records for PotterBot &amp; resin slicers</div>
              </div>
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">DXF Vector Contours</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">Plaster mold templates &amp; CNC lathe turning profiles</div>
              </div>
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">SVG Profile Cross-Sections</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">2D silhouette prints for ceramic slip casting</div>
              </div>
            </div>
          </div>

          {/* Tile 3: Full-Width Asymmetric Invariant Tile (12 cols) - Atelier Privacy */}
          <div className="lg:col-span-12 p-6 sm:p-8 rounded-xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-[#70695e] dark:text-[#8a8276]">
                <Shield className="w-4 h-4 text-[#8f643f] dark:text-[#d4a373]" />
                <span className="font-semibold text-[#1e1c19] dark:text-[#dcd8d0] uppercase tracking-widest text-[11px] font-mono">
                  02 // PRIVATE ATELIER INVARIANT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
                Zero-Auth, Zero-Cloud, Sovereign Local Storage
              </h3>
              <p className="text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed">
                No user accounts, tracking cookies, or remote geometry storage. Your bespoke vessel silhouettes and CAD states remain strictly within your browser&apos;s private local storage.
              </p>
            </div>

            <Link
              href="/sandbox"
              className="px-5 py-2.5 rounded-lg border border-[#ded9cf] dark:border-[#2d2b27] hover:border-[#b8b1a3] dark:hover:border-[#47433d] bg-transparent text-[#262421] dark:text-[#cfc9be] transition-colors text-xs font-semibold whitespace-nowrap"
            >
              Verify In Sandbox
            </Link>
          </div>

        </div>
      </section>

      {/* Early Access Action Section */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-[11px] font-mono font-semibold text-[#857d72] dark:text-[#787166] uppercase tracking-widest">
              03 // AMONITE PRO ATELIER
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
              Looking for glaze shaders, pottery lathe rigs &amp; mold offsets?
            </h3>
            <p className="text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed">
              We are expanding the Amonite object studio with procedural ceramic glazes, slip-cast mold split lines, and direct G-code toolpaths for clay 3D printers. Direct priority intake managed at <span className="text-[#141311] dark:text-[#f2efe9] font-semibold">amoniteadmin@gmail.com</span>.
            </p>
          </div>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="px-6 py-3 rounded-lg bg-[#1a1917] hover:bg-[#2c2a26] text-[#fcfbf9] dark:bg-[#ece8df] dark:hover:bg-[#ffffff] dark:text-[#161513] font-semibold text-xs transition-colors whitespace-nowrap"
          >
            Request Early Access
          </button>
        </div>
      </section>

      {/* Monochromatic Organic Technical Footer */}
      <footer className="mt-auto border-t border-[#e6e2da] dark:border-[#262421] bg-[#f7f5f0] dark:bg-[#0e0d0c] py-10 px-4 sm:px-6 text-xs text-[#7c756b] dark:text-[#8e877c] font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6 rounded bg-[#ebe7de] dark:bg-[#1e1c1a] border border-[#ded9ce] dark:border-[#2b2825] flex items-center justify-center p-1">
              <Image
                src="/logo-mark.svg"
                alt="Amonite Logo"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-[#1e1c19] dark:text-[#dcd8d0] font-bold">AMONITE</span>
            <span className="text-[#a8a194] dark:text-[#47433d]">{'//'}</span>
            <span className="text-[#70695e] dark:text-[#9e9688]">Minimalist 3D Object Studio</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/sandbox" className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors">
              Studio Sandbox
            </Link>
            <Link href="/docs" className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors">
              Technical Documentation
            </Link>
            <a
              href="https://github.com/jhaabhijeet864/amonite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="mailto:amoniteadmin@gmail.com"
              className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors"
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
