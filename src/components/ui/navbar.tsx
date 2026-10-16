'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Terminal, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenWaitlist?: () => void;
  onOpenFileExchange?: () => void;
}

export default function Navbar({ onOpenWaitlist, onOpenFileExchange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090c]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 transition-colors group-hover:border-white/20">
            <Image
              src="/logo-mark.svg"
              alt="Amonite CAD"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white font-mono text-sm">
                AMONITE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                CAD/CAM
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline tracking-tight">
              Client Solid Geometry Engine
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-zinc-400">
          <Link
            href="/sandbox"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Studio Sandbox</span>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Architecture & Specs</span>
          </Link>
          <a
            href="https://github.com/jhaabhijeet864/amonite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Source Code</span>
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {onOpenFileExchange && (
            <button
              onClick={onOpenFileExchange}
              className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 transition-colors"
            >
              File I/O
            </button>
          )}

          <Link
            href="/sandbox"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 transition-colors font-medium"
          >
            Launch CAD
          </Link>

          {onOpenWaitlist && (
            <button
              onClick={onOpenWaitlist}
              className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Join Waitlist</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
