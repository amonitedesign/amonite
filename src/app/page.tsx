'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Cpu,
  Shield,
  Box,
} from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import WaitlistModal from '@/components/landing/waitlist-modal';
import FileDialog from '@/components/io/file-dialog';
import DesignerShowcase from '@/components/landing/designer-showcase';

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isFileExchangeOpen, setIsFileExchangeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbfaf7] dark:bg-[#121110] text-[#1c1a17] dark:text-[#dcd8d0] font-mono flex flex-col selection:bg-[#d4a373] selection:text-black transition-colors">
      <Navbar
        onOpenFileExchange={() => setIsFileExchangeOpen(true)}
      />

      {/* 3D Minimalist Object Studio Hero */}
      <section className="relative w-full pt-12 sm:pt-16 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-start max-w-3xl">
          
          {/* Minimal Studio Eyebrow: Quiet Organic Tracking-Widest */}
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#7c756b] dark:text-[#8e877c] mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c28456] dark:bg-[#d4a373]" />
            <span>PARAMETRIC DECOR STUDIO // BESPOKE VASES &amp; CERAMICS</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#141311] dark:text-[#f2efe9] tracking-tight leading-[1.06] text-left">
            Sculpt bespoke minimal vases &amp; interior decor, right in your browser.
          </h1>

          {/* Quiet Subtext */}
          <p className="mt-5 text-[#5e574d] dark:text-[#a8a194] text-sm sm:text-base leading-relaxed text-left max-w-2xl">
            A dedicated digital studio for boutique makers and interior decorators. Generate infinite, print-ready variations of fluted vases, ribbed planters, and lighting shells for your Etsy shop or design client—ready for continuous extrusion, clay printing, and slip-casting.
          </p>

          {/* Action Triggers: Immediate Gallery Primary Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/sandbox"
              className="px-6 py-3 rounded-lg bg-[#1a1917] hover:bg-[#2c2a26] text-[#fcfbf9] dark:bg-[#ece8df] dark:hover:bg-[#ffffff] dark:text-[#161513] font-semibold transition-colors flex items-center gap-2 text-sm"
            >
              <span>Open Studio Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="px-6 py-3 rounded-lg border border-[#ded9cf] dark:border-[#2d2b27] hover:border-[#b8b1a3] dark:hover:border-[#47433d] bg-transparent text-[#262421] dark:text-[#cfc9be] transition-colors text-sm font-semibold"
            >
              Join Pro Waitlist
            </button>
          </div>

          {/* Object Studio Telemetry Specs */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full pt-6 border-t border-[#e6e2da] dark:border-[#262421]">
            <div>
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">PRINT RELIABILITY</div>
              <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">Guaranteed Watertight</div>
            </div>
            <div>
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">SLICING PROFILE</div>
              <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">Vase Mode (Spiralize)</div>
            </div>
            <div>
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">WALL TOLERANCE</div>
              <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">±0.1 mm precision</div>
            </div>
            <div>
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-widest font-semibold">PRODUCTION SPEED</div>
              <div className="text-sm font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">Instant STL in 0s</div>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrating Designer Work Showcase Section */}
      <DesignerShowcase />

      {/* Asymmetric Minimalist Specification Bento Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[#e6e2da] dark:border-[#262421]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-[11px] font-mono font-semibold text-[#857d72] dark:text-[#787166] uppercase tracking-widest mb-2">
              01 // STUDIO METHODOLOGY
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141311] dark:text-[#f2efe9] tracking-tight">
              Crafted for bespoke vases, planters &amp; decor
            </h2>
          </div>
          <p className="text-xs text-[#5e574d] dark:text-[#a8a194] max-w-md leading-relaxed">
            Eliminating traditional CAD complexity to focus purely on tactile curvature, rib waveforms, and flawless physical printability.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tile 1: Primary Wide Tile (8 cols) - Tactile Morphology & Physical Specs */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#70695e] dark:text-[#8a8276] mb-4 pb-3 border-b border-[#e3dfd6] dark:border-[#262421]">
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-[#8f643f] dark:text-[#d4a373]" />
                  <span className="font-semibold text-[#1e1c19] dark:text-[#dcd8d0] uppercase tracking-wider">TACTILE MORPHOLOGY</span>
                </span>
                <span className="font-mono text-[10px]">ORGANIC FLUTING &middot; CONTINUOUS WALLS</span>
              </div>
              <h3 className="text-lg font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
                Infinite product variations for Etsy shops &amp; bespoke interiors
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed max-w-2xl">
                Sculpt fluted vases, ribbed Nordic planters, organic bowls, and twisted lamp shells with intuitive tactile sliders. Seamlessly adjust rib count, wave amplitude, neck taper, and rotational twist to produce distinctive collections in minutes without manual CAD drafting.
              </p>
            </div>

            {/* Spec Feature Row: Physical Fabrication Specifications */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">1-Click Etsy Drop</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">ZIP of 6 scaled STLs + listing mockups</div>
              </div>
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">Vase Mode Certified</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">Continuous single-wall extrusion, zero z-seam</div>
              </div>
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">Kiln Compensation</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">Pre-scaled +8% to +15% for ceramic shrinkage</div>
              </div>
            </div>
          </div>

          {/* Tile 2: Secondary Tall Tile (4 cols) - Clay Shrinkage & Slicer Pipeline */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#70695e] dark:text-[#8a8276] mb-4 pb-3 border-b border-[#e3dfd6] dark:border-[#262421]">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#8f643f] dark:text-[#d4a373]" />
                  <span className="font-semibold text-[#1e1c19] dark:text-[#dcd8d0] uppercase tracking-wider">FABRICATION RELIABILITY</span>
                </span>
                <span className="font-mono text-[10px]">SLICER READY</span>
              </div>
              <h3 className="text-base font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
                Flawless toolpaths for clay, resin &amp; FDM
              </h3>
              <p className="mt-2 text-xs text-[#5e574d] dark:text-[#a8a194] leading-relaxed">
                Direct export pipeline designed specifically for ceramic clay 3D printers and continuous vase-mode slicing.
              </p>
            </div>

            <div className="mt-6 space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">Clay Shrinkage Tool</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">Automatic 8%–15% kiln firing compensation for stoneware &amp; porcelain</div>
              </div>
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">Vase Mode (Spiralize)</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">Continuous single-wall extrusion with zero z-seam defects</div>
              </div>
              <div className="p-3 rounded-lg bg-[#ebe7de] dark:bg-[#201e1b] border border-[#ded9ce] dark:border-[#282622]">
                <div className="text-xs font-semibold text-[#1e1c19] dark:text-[#ece8df]">Instant Watertight STL</div>
                <div className="text-[10px] text-[#70695e] dark:text-[#8a8276] mt-0.5">100% manifold mesh guarantee for Bambu Studio, PrusaSlicer &amp; Cura</div>
              </div>
            </div>
          </div>

          {/* Tile 3: Full-Width Asymmetric Invariant Tile (12 cols) - Atelier Privacy */}
          <div className="lg:col-span-12 p-6 sm:p-8 rounded-xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-[#70695e] dark:text-[#8a8276]">
                <Shield className="w-4 h-4 text-[#8f643f] dark:text-[#d4a373]" />
                <span className="font-semibold text-[#1e1c19] dark:text-[#dcd8d0] uppercase tracking-widest text-[11px] font-mono">
                  02 // PRIVATE STUDIO INVARIANT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
                Zero-Auth, Zero-Cloud, Sovereign Local Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed">
                No user accounts, tracking cookies, or remote geometry storage. Your bespoke vessel silhouettes and studio states remain strictly within your browser&apos;s private local storage.
              </p>
            </div>

            <Link
              href="/sandbox"
              className="px-5 py-2.5 rounded-lg border border-[#ded9cf] dark:border-[#2d2b27] hover:border-[#b8b1a3] dark:hover:border-[#47433d] bg-transparent text-[#262421] dark:text-[#cfc9be] transition-colors text-xs font-semibold whitespace-nowrap"
            >
              Verify In Studio
            </Link>
          </div>

        </div>
      </section>

      {/* Early Access Action Section */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-[11px] font-mono font-semibold text-[#857d72] dark:text-[#787166] uppercase tracking-widest">
              03 // PLANS — FREE, PRO, STUDIO
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight font-display">
              Looking for commercial presets, batch variations &amp; mold split lines?
            </h3>
            <p className="text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed">
              We are expanding Amonite with commercial starter families (Japandi, Brutalism, Organic Modern), batch STL variation exports for Etsy, and slip-cast mold split lines.{' '}
              <Link href="/pricing" className="text-[#141311] dark:text-[#f2efe9] font-semibold underline underline-offset-4">
                Compare plans
              </Link>
              . Early access priority intake is handled at <span className="text-[#141311] dark:text-[#f2efe9] font-semibold">amoniteadmin@gmail.com</span>.
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
            <span className="text-[#70695e] dark:text-[#9e9688]">The 3D Studio for Minimalist Interior Decor</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/sandbox" className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors">
              Studio Sandbox
            </Link>
            <Link href="/docs" className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors">
              Technical Documentation
            </Link>
            <Link href="/pricing" className="hover:text-[#1e1c19] dark:hover:text-[#f2efe9] transition-colors">
              Pricing
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
