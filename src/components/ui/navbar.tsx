'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Layers } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';

interface NavbarProps {
  onOpenWaitlist?: () => void;
  onOpenFileExchange?: () => void;
}

export default function Navbar({ onOpenWaitlist }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#08090b]/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Left Section */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 flex items-center justify-center p-1.5 transition-colors group-hover:border-zinc-400 dark:group-hover:border-white/20">
              <Image
                src="/logo-mark.svg"
                alt="Amonite CAD"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <span className="font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono text-base">
              AMONITE
            </span>
          </Link>

          {/* Small GitHub Icon Button on the Left */}
          <a
            href="https://github.com/jhaabhijeet864/amonite"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            title="GitHub Repository"
            className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] hover:bg-zinc-100 dark:hover:bg-white/[0.08] text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-colors ml-1"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <Link
            href="/sandbox"
            className="flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Studio Sandbox</span>
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-2 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Architecture & Specs</span>
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          <Link
            href="/sandbox"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 hover:bg-zinc-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-800 dark:text-zinc-200 transition-colors font-medium"
          >
            Launch CAD
          </Link>

          {onOpenWaitlist && (
            <button
              onClick={onOpenWaitlist}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Join Waitlist</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
