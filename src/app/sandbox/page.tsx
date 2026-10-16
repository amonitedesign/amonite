'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileBox,
  ArrowLeft,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import CADCanvas from '@/components/cad/cad-canvas';
import VesselArchetypes from '@/components/cad/vessel-archetypes';
import VesselStudio from '@/components/cad/vessel-studio';
import StudioSettings from '@/components/cad/studio-settings';
import FileDialog from '@/components/io/file-dialog';
import ProBadge from '@/components/ui/pro-badge';
import { useProStatus } from '@/lib/pro-status';
import { STUDIO_THEME } from '@/lib/studio-theme';
import { useCADStore } from '@/store/cad-store';
import { saveWorkspaceLocally, loadWorkspaceLocally } from '@/lib/storage';

export default function SandboxPage() {
  const [isFileOpen, setIsFileOpen] = useState(false);

  const nodes = useCADStore((s) => s.nodes);
  const viewport = useCADStore((s) => s.viewport);
  const theme = useCADStore((s) => s.settings.theme);
  const autosaveEnabled = useCADStore((s) => s.settings.autosaveEnabled);
  const loadProject = useCADStore((s) => s.loadProject);
  const ensureVessel = useCADStore((s) => s.ensureVessel);
  const setCameraPreset = useCADStore((s) => s.setCameraPreset);
  const undo = useCADStore((s) => s.undo);
  const redo = useCADStore((s) => s.redo);
  const { isPro } = useProStatus();
  const t = STUDIO_THEME[theme].chrome;

  // Load from local storage on initial mount, then guarantee the vessel piece.
  useEffect(() => {
    const saved = loadWorkspaceLocally();
    if (saved && saved.nodes && saved.nodes.length > 0) {
      loadProject(saved);
    }
    ensureVessel();
  }, [loadProject, ensureVessel]);

  // Debounced autosave (honours the Workshop toggle)
  useEffect(() => {
    if (!autosaveEnabled) return;
    const timer = setTimeout(() => {
      saveWorkspaceLocally(nodes, viewport);
    }, 1500);

    return () => clearTimeout(timer);
  }, [nodes, viewport, autosaveEnabled]);

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
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col font-mono"
      style={{ backgroundColor: t.pageBg, color: t.ink }}
    >
      {/* Top Application Bar */}
      <header
        className="h-12 border-b px-4 flex items-center justify-between z-30 select-none"
        style={{ backgroundColor: t.headerBg, borderColor: t.hairline }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors"
            style={{ color: t.inkMute }}
            onMouseEnter={(e) => { e.currentTarget.style.color = t.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.inkMute; }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <Image
              src="/logo-mark.svg"
              alt="Amonite"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="font-extrabold text-sm tracking-tight" style={{ color: t.ink }}>
              AMONITE
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsFileOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors"
            style={{ backgroundColor: t.wellBg, borderColor: t.hairline, color: t.ink }}
          >
            <FileBox className="w-3.5 h-3.5" style={{ color: t.accentSoft }} />
            <span>Files</span>
          </button>

          <StudioSettings />

          {isPro ? (
            <ProBadge className="bg-[#c96f4b]/15 border-[#c96f4b]/30 text-[#f0caa3]" />
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors"
              style={{ backgroundColor: t.primaryBtnBg, color: t.primaryBtnInk }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.primaryBtnHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = t.primaryBtnBg; }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get Pro</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Studio Viewport Area */}
      <div className="relative flex-1 w-full h-[calc(100vh-48px)] overflow-hidden">
        {/* Fullscreen 3D Atelier Canvas */}
        <CADCanvas className="absolute inset-0 z-0" />

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
            className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] shadow-2xl backdrop-blur-md transition-colors"
            style={{ borderColor: t.hairline, backgroundColor: t.panelBg, color: t.inkSoft }}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset view</span>
          </button>

          <span className="hidden font-mono text-[10px] sm:inline pl-2" style={{ color: t.inkFaint }}>
            Drag to orbit · Scroll to zoom
          </span>
        </div>
      </div>

      {/* Modals */}
      <FileDialog isOpen={isFileOpen} onClose={() => setIsFileOpen(false)} />
    </div>
  );
}
