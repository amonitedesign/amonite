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

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isFileExchangeOpen, setIsFileExchangeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#08090b] text-zinc-900 dark:text-slate-300 font-mono flex flex-col selection:bg-cyan-300 selection:text-black transition-colors">
      <Navbar
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
        onOpenFileExchange={() => setIsFileExchangeOpen(true)}
      />

      {/* Interior-focused hero — single column, left-anchored type */}
      <section className="relative w-full pt-12 sm:pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl flex flex-col items-start pt-2">

          {/* Eyebrow: Mono Uppercase Tracking-Widest, No Pill Glow */}
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-slate-400 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
            <span>Room planner // Browser-native CAD</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.08] text-left">
            Plan rooms to the millimetre, right in your browser.
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-zinc-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed text-left max-w-xl">
            Space planning, 2D floor-plan drafting, and furniture layouts for
            designers and homeowners alike. Private by construction — no
            install, no account, everything runs on your machine.
          </p>

          {/* Interior Metrics Matrix */}
          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md pt-6 border-t border-zinc-200 dark:border-white/[0.08]">
            <div>
              <div className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Layout accuracy</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-slate-200 mt-0.5">±1 mm</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Planning modes</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-slate-200 mt-0.5">Floor-plan + 3D</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Contractor handoff</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-slate-200 mt-0.5">DXF floor plans</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Privacy</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-slate-200 mt-0.5">0 bytes leave your browser</div>
            </div>
          </div>

          {/* Action Triggers: Primary Solid Cyan-300 + Secondary Bordered */}
          <div className="mt-8 flex flex-wrap items-center gap-3 w-full">
            <Link
              href="/sandbox"
              className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 dark:bg-cyan-300 dark:hover:bg-cyan-200 text-black font-semibold transition-colors flex items-center gap-2 text-xs"
            >
              <span>Open Studio Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/20 bg-zinc-50 dark:bg-[#101216] text-zinc-900 dark:text-slate-200 transition-colors text-xs font-semibold"
            >
              Join Pro Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Asymmetric Space-Planning Bento Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-zinc-200 dark:border-white/[0.08]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-[11px] font-mono font-semibold text-zinc-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              01 // SPACE PLANNING
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Rooms, walls & furniture in one canvas
            </h2>
          </div>
          <p className="text-xs text-zinc-600 dark:text-slate-400 max-w-md leading-relaxed">
            Draw a floor plan, raise it into walls, and arrange furniture — then hand exact drawings to your contractor.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tile 1: Primary Wide Tile (8 cols) - Room Kit */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-xl bg-zinc-50 dark:bg-[#0d0f13] border border-zinc-200 dark:border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-slate-500 mb-4 pb-3 border-b border-zinc-200 dark:border-white/[0.08]">
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-zinc-700 dark:text-slate-300" />
                  <span className="font-semibold text-zinc-800 dark:text-slate-300 uppercase tracking-wider">ROOM KIT</span>
                </span>
                <span className="font-mono text-[10px]">PLAN &middot; RAISE &middot; ARRANGE</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight font-display">
                Floor plans, walls & furniture blocks
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Sketch a room outline and raise it into 100 mm walls, drop in
                wardrobes, sofas, and kitchen runs from the primitive kit, and
                nudge everything into place with millimetre grid snapping.
              </p>
            </div>

            {/* Monospace Room Spec Callout */}
            <div className="mt-6 p-4 rounded-lg bg-zinc-100 dark:bg-[#161a22] border border-zinc-200 dark:border-white/[0.04] text-[11px] font-mono text-zinc-700 dark:text-slate-400 space-y-1 overflow-x-auto">
              <div className="text-zinc-500 dark:text-slate-500">{'// Living room — first draft'}</div>
              <div className="text-zinc-900 dark:text-slate-300">room 4.2 x 3.6 m · wall 100 mm · snap 5 mm</div>
              <div className="text-zinc-500 dark:text-slate-500">{'// Handoff to contractor'}</div>
              <div className="text-zinc-900 dark:text-slate-300">export floor-plan.dxf · elevations.svg</div>
            </div>
          </div>

          {/* Tile 2: Secondary Tall Tile (4 cols) - Contractor Handoff */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-xl bg-zinc-50 dark:bg-[#0d0f13] border border-zinc-200 dark:border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-slate-500 mb-4 pb-3 border-b border-zinc-200 dark:border-white/[0.08]">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-zinc-700 dark:text-slate-300" />
                  <span className="font-semibold text-zinc-800 dark:text-slate-300 uppercase tracking-wider">CONTRACTOR HANDOFF</span>
                </span>
                <span className="font-mono text-[10px]">JOB READY</span>
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight font-display">
                Drawings your maker can build from
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                Export the exact files carpenters, joiners, and fabricators ask for — generated in your browser.
              </p>
            </div>

            <div className="mt-6 space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-[#161a22] border border-zinc-200 dark:border-white/[0.04]">
                <div className="text-xs font-semibold text-zinc-900 dark:text-slate-200">DXF floor plans</div>
                <div className="text-[10px] text-zinc-500 dark:text-slate-500 mt-0.5">Dimensioned layouts for carpenters & joiners</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-[#161a22] border border-zinc-200 dark:border-white/[0.04]">
                <div className="text-xs font-semibold text-zinc-900 dark:text-slate-200">SVG elevations</div>
                <div className="text-[10px] text-zinc-500 dark:text-slate-500 mt-0.5">Wall views for tiling, paint & panel quotes</div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-[#161a22] border border-zinc-200 dark:border-white/[0.04]">
                <div className="text-xs font-semibold text-zinc-900 dark:text-slate-200">STL scale models</div>
                <div className="text-[10px] text-zinc-500 dark:text-slate-500 mt-0.5">3D-print a miniature of the finished room</div>
              </div>
            </div>
          </div>

          {/* Tile 3: Full-Width Asymmetric Invariant Tile (12 cols) - Zero-Egress Privacy */}
          <div className="lg:col-span-12 p-6 sm:p-8 rounded-xl bg-zinc-50 dark:bg-[#0d0f13] border border-zinc-200 dark:border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-slate-400">
                <Shield className="w-4 h-4 text-zinc-700 dark:text-slate-300" />
                <span className="font-semibold text-zinc-800 dark:text-slate-300 uppercase tracking-widest text-[11px] font-mono">
                  02 // CLIENT SECURITY INVARIANT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight font-display">
                Zero-Auth, Zero-Tracking, Zero-Egress Storage
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-slate-400 leading-relaxed">
                No accounts, no tracking, no cloud uploads. Room plans,
                furniture layouts, and history stay strictly in your
                browser&apos;s private local storage.
              </p>
            </div>

            <Link
              href="/sandbox"
              className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/20 bg-white dark:bg-[#101216] text-zinc-900 dark:text-slate-200 transition-colors text-xs font-semibold whitespace-nowrap"
            >
              Verify In Sandbox
            </Link>
          </div>

        </div>
      </section>

      {/* Early Access Action Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 dark:bg-[#0d0f13] border border-zinc-200 dark:border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-[11px] font-mono font-semibold text-zinc-400 dark:text-slate-500 uppercase tracking-widest">
              03 // AMONITE PRO QUEUE
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight font-display">
              Need material libraries, cut lists & contractor sharing?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-slate-400 leading-relaxed">
              Amonite Pro adds finish and material palettes, joinery cut lists,
              and shareable client rooms. Direct priority queue managed at <span className="text-zinc-900 dark:text-slate-200 font-semibold">amoniteadmin@gmail.com</span>.
            </p>
          </div>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 dark:bg-cyan-300 dark:hover:bg-cyan-200 text-black font-semibold text-xs transition-colors whitespace-nowrap"
          >
            Request Early Access
          </button>
        </div>
      </section>

      {/* Monochromatic Technical Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#060709] py-10 px-4 sm:px-6 text-xs text-zinc-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6 rounded bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 flex items-center justify-center p-1">
              <Image
                src="/logo-mark.svg"
                alt="Amonite Logo"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-zinc-900 dark:text-slate-300 font-bold">AMONITE CAD</span>
            <span className="text-zinc-400 dark:text-slate-600">{'//'}</span>
            <span className="text-zinc-500 dark:text-slate-400">Public Foundational Micro-SaaS</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/sandbox" className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors">
              Studio Sandbox
            </Link>
            <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors">
              Technical Documentation
            </Link>
            <a
              href="https://github.com/jhaabhijeet864/amonite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="mailto:amoniteadmin@gmail.com"
              className="hover:text-zinc-900 dark:hover:text-slate-300 transition-colors"
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
