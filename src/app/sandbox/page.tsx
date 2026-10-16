'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileBox,
  Save,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-react';
import CADCanvas from '@/components/cad/cad-canvas';
import VesselArchetypes from '@/components/cad/vessel-archetypes';
import VesselStudio from '@/components/cad/vessel-studio';
import FileDialog from '@/components/io/file-dialog';
import { useCADStore } from '@/store/cad-store';
import { saveWorkspaceLocally, loadWorkspaceLocally } from '@/lib/storage';

export default function SandboxPage() {
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const nodes = useCADStore((s) => s.nodes);
  const viewport = useCADStore((s) => s.viewport);
  const loadProject = useCADStore((s) => s.loadProject);
  const ensureVessel = useCADStore((s) => s.ensureVessel);
  const setCameraPreset = useCADStore((s) => s.setCameraPreset);
  const undo = useCADStore((s) => s.undo);
  const redo = useCADStore((s) => s.redo);

  // Load from local storage on initial mount, then guarantee the vessel piece.
  useEffect(() => {
    const saved = loadWorkspaceLocally();
    if (saved && saved.nodes && saved.nodes.length > 0) {
      loadProject(saved);
    }
    ensureVessel();
  }, [loadProject, ensureVessel]);

  // Debounced autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      saveWorkspaceLocally(nodes, viewport);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [nodes, viewport]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#161310] flex flex-col font-mono text-[#ece5d8]">
      {/* Top Application Bar */}
      <header className="h-12 bg-[#1c1712] border-b border-white/[0.07] px-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#a89e8d] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/[0.05] border border-white/10 flex items-center justify-center p-0.5">
              <Image
                src="/logo-mark.svg"
                alt="Amonite"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              AMONITE ATELIER
            </span>
            <span className="text-[10px] bg-[#c96f4b]/15 text-[#d98f66] px-1.5 py-0.5 rounded border border-[#c96f4b]/25">
              3D PRINT READY
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#a89e8d] border-l border-white/[0.07] pl-3 ml-2">
            <Save className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-400' : 'text-[#6b6257]'}`} />
            <span>{isSaved ? 'Autosaved' : 'Autosave on'}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsFileOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-[#ece5d8] transition-colors"
          >
            <FileBox className="w-3.5 h-3.5 text-[#d98f66]" />
            <span>Files</span>
          </button>

          <Link
            href="/docs"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#a89e8d] hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Help and documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ede4d3] hover:bg-white text-[#221c14] font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Pro</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Viewport Area */}
      <div className="relative flex-1 w-full h-[calc(100vh-48px)] overflow-hidden">
        {/* Fullscreen 3D Atelier Canvas */}
        <CADCanvas className="absolute inset-0 z-0" autoRotate={autoRotate} />

        {/* Left Side Base Form Menu */}
        <div className="absolute top-20 left-4 z-20 hidden md:block">
          <VesselArchetypes />
        </div>

        {/* Right Side Parametric Studio Panel */}
        <div className="absolute top-20 right-4 z-20 hidden md:block">
          <VesselStudio />
        </div>

        {/* Bottom Center Minimal View Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCameraPreset('iso')}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1e1a15]/95 px-3.5 py-1.5 font-mono text-[11px] text-[#d8cfbd] shadow-2xl backdrop-blur-md transition-colors hover:border-white/25 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset view</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] shadow-2xl backdrop-blur-md transition-colors ${
              autoRotate
                ? 'border-[#c96f4b]/30 bg-[#c96f4b]/15 text-[#f0caa3]'
                : 'border-white/10 bg-[#1e1a15]/95 text-[#a89e8d] hover:text-white'
            }`}
            title="Toggle turntable auto-rotation"
          >
            {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>Turntable</span>
          </button>

          <span className="hidden font-mono text-[10px] text-[#6b6257] sm:inline pl-2">
            Drag to orbit · Scroll to zoom
          </span>
        </div>
      </div>

      {/* Modals */}
      <FileDialog isOpen={isFileOpen} onClose={() => setIsFileOpen(false)} />
    </div>
  );
}
