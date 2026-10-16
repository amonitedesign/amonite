'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Sparkles, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenWaitlist?: () => void;
  onOpenFileExchange?: () => void;
}

export default function Navbar({ onOpenWaitlist, onOpenFileExchange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0b0e]/80 backdrop-blur-md border-b border-[#1c212c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center p-1 overflow-hidden transition-all group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Image
              src="/logo-mark.svg"
              alt="Amonite CAD"
              width={26}
              height={26}
              className="object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white font-mono text-base">
                AMONITE
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                CAD/CAM
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline -mt-0.5">
              Browser Micro-SaaS
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
          <Link
            href="/sandbox"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Studio Sandbox</span>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Docs & Shortcuts</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Open Source</span>
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {onOpenFileExchange && (
            <button
              onClick={onOpenFileExchange}
              className="px-3 py-1.5 rounded-lg border border-[#272d3b] bg-[#14171f] hover:bg-[#1a1f2b] text-slate-300 transition-colors"
            >
              File I/O
            </button>
          )}

          <Link
            href="/sandbox"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all font-semibold"
          >
            Launch CAD
          </Link>

          {onOpenWaitlist && (
            <button
              onClick={onOpenWaitlist}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Waitlist</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
