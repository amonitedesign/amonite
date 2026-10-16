'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Maximize2,
  Cpu,
  Layers,
  FileCode,
  ShieldCheck,
  Compass,
  Boxes,
  Lock,
  Zap,
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
    <div className="min-h-screen bg-[#08090b] text-slate-200 font-mono flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
        onOpenFileExchange={() => setIsFileExchangeOpen(true)}
      />

      {/* Hero Section with Live Interactive CAD Sandbox */}
      <section className="relative w-full pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-semibold mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>ZERO-AUTH BROWSER CAD/CAM ENGINE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white text-center tracking-tight max-w-4xl leading-tight">
          Precision Engineering in Your Browser.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            Zero Barriers.
          </span>
        </h1>

        <p className="mt-4 text-slate-400 text-sm sm:text-base text-center max-w-2xl leading-relaxed">
          Hardware-accelerated 3D WebGL solids modeling, 2D vector drafting, client-side math, and instant STL/DXF parsing. 100% private, client-side CAD for modern engineers and fabricators.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
          <Link
            href="/sandbox"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center gap-2 text-sm"
          >
            <span>Open Studio Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="px-6 py-3 rounded-xl bg-[#141720] hover:bg-[#1a202d] border border-[#272d3b] hover:border-cyan-500/40 text-slate-200 transition-all text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Join Pro Waitlist</span>
          </button>
        </div>

        {/* Hero Live Interactive Viewport Card */}
        <div className="mt-12 w-full max-w-5xl rounded-2xl border border-[#232938] bg-[#0c0e13] shadow-2xl overflow-hidden relative group">
          {/* Viewport Frame Header */}
          <div className="h-10 bg-[#12151c] border-b border-[#232938] px-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 font-bold text-slate-300">Amonite Hero Viewport (WebGL)</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500 hidden sm:inline">Orbit: Left Click | Pan: Right Click</span>
              <Link
                href="/sandbox"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold ml-2"
              >
                <span>Fullscreen</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive WebGL Container */}
          <div className="relative w-full h-[480px]">
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
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[#191e2b]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built for Industrial Design & Fabrication
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">
            Everything you need to design, inspect, and export solid geometry directly in the client runtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[#1f2636] bg-[#0d1016] flex flex-col gap-3 group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Client-Side WebGL Acceleration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native hardware GPU raycasting, OrbitControls, and 120fps fluid transformation gizmos without server roundtrips.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1f2636] bg-[#0d1016] flex flex-col gap-3 group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">STL, DXF & SVG Interchange</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate 3D printing triangle meshes (.stl) or CNC-ready AutoCAD ASCII vectors (.dxf) instantly in browser memory.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#1f2636] bg-[#0d1016] flex flex-col gap-3 group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero-Auth & Local Session Persistence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No account creation, cookies, or tracking. Your CAD geometries auto-save strictly to your browser's private local storage.
            </p>
          </div>
        </div>
      </section>

      {/* Early Access Callout Banner */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full mb-16">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0d1522] via-[#0b1019] to-[#0c1626] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Amonite Pro Roadmap</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Interested in Cloud Sync & CAM Toolpaths?
            </h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Join the priority queue for advanced 4-axis / 5-axis CNC toolpaths, generative topology optimization, and team vaults.
            </p>
          </div>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap"
          >
            Join Early Access
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#161a24] bg-[#060709] py-8 px-4 sm:px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-mark.svg"
              alt="Amonite Logo"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-slate-300 font-bold">AMONITE CAD</span>
            <span>— Public Foundational Ecosystem</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/sandbox" className="hover:text-cyan-400 transition-colors">
              Studio Sandbox
            </Link>
            <Link href="/docs" className="hover:text-cyan-400 transition-colors">
              Documentation
            </Link>
            <a
              href="mailto:amoniteadmin@gmail.com"
              className="hover:text-cyan-400 transition-colors"
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
