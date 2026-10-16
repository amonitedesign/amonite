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
} from 'lucide-react';
import CADCanvas from '@/components/cad/cad-canvas';
import CADToolbar from '@/components/cad/cad-toolbar';
import CADInspector from '@/components/cad/cad-inspector';
import CADTree from '@/components/cad/cad-tree';
import CADViewControls from '@/components/cad/cad-view-controls';
import CADMeasure from '@/components/cad/cad-measure';
import CADDraftingOverlay from '@/components/cad/cad-drafting-overlay';
import FileDialog from '@/components/io/file-dialog';
import { useCADStore } from '@/store/cad-store';
import { saveWorkspaceLocally, loadWorkspaceLocally } from '@/lib/storage';

export default function SandboxPage() {
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const nodes = useCADStore((s) => s.nodes);
  const viewport = useCADStore((s) => s.viewport);
  const selectedId = useCADStore((s) => s.selectedId);
  const loadProject = useCADStore((s) => s.loadProject);
  const undo = useCADStore((s) => s.undo);
  const redo = useCADStore((s) => s.redo);
  const removeNode = useCADStore((s) => s.removeNode);
  const duplicateNode = useCADStore((s) => s.duplicateNode);
  const setTransformMode = useCADStore((s) => s.setTransformMode);
  const measureActive = useCADStore((s) => s.measureActive);
  const setMeasureActive = useCADStore((s) => s.setMeasureActive);
  const setMeasurePoints = useCADStore((s) => s.setMeasurePoints);
  const draftingActive = useCADStore((s) => s.draftingActive);
  const setDraftingActive = useCADStore((s) => s.setDraftingActive);
  const setDraftPoints = useCADStore((s) => s.setDraftPoints);
  const commitDraftAsExtrusion = useCADStore((s) => s.commitDraftAsExtrusion);

  // Load from local storage on initial mount
  useEffect(() => {
    const saved = loadWorkspaceLocally();
    if (saved && saved.nodes && saved.nodes.length > 0) {
      loadProject(saved);
    }
  }, [loadProject]);

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
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedId) duplicateNode(selectedId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) removeNode(selectedId);
      } else if (e.key.toLowerCase() === 'v') {
        setTransformMode('select');
      } else if (e.key.toLowerCase() === 'g') {
        setTransformMode('translate');
      } else if (e.key.toLowerCase() === 'r') {
        setTransformMode('rotate');
      } else if (e.key.toLowerCase() === 's') {
        setTransformMode('scale');
      } else if (e.key.toLowerCase() === 'm') {
        if (measureActive) setMeasurePoints(null);
        setMeasureActive(!measureActive);
      } else if (e.key.toLowerCase() === 'p') {
        if (draftingActive) setDraftPoints([]);
        setDraftingActive(!draftingActive);
      } else if (e.key === 'Enter') {
        if (draftingActive) commitDraftAsExtrusion();
      } else if (e.key === 'Escape') {
        setMeasurePoints(null);
        setMeasureActive(false);
        setDraftPoints([]);
        setDraftingActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, undo, redo, duplicateNode, removeNode, setTransformMode, measureActive, setMeasureActive, setMeasurePoints, draftingActive, setDraftingActive, setDraftPoints, commitDraftAsExtrusion]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0b0e] flex flex-col font-mono text-slate-200">
      {/* Top Application Bar */}
      <header className="h-12 bg-[#0d0f14] border-b border-[#1f2430] px-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center p-0.5">
              <Image
                src="/logo-mark.svg"
                alt="Amonite CAD"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              AMONITE // STUDIO
            </span>
            <span className="text-[10px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">
              ZERO-AUTH
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 border-l border-[#232733] pl-3 ml-2">
            <Save className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{isSaved ? 'Autosaved Locally' : 'Local Storage Active'}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsFileOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161a22] hover:bg-slate-800 border border-[#272d3b] text-slate-300 transition-colors"
          >
            <FileBox className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import / Export</span>
          </button>

          <Link
            href="/docs"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Shortcuts and Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Pro</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Viewport Area */}
      <div className="relative flex-1 w-full h-[calc(100vh-48px)] overflow-hidden">
        {/* Fullscreen 3D WebGL Canvas */}
        <CADCanvas className="absolute inset-0 z-0" />

        {/* Top Centered Floating CAD Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <CADToolbar />
        </div>

        {/* Bottom Left Viewport HUD & View Controls */}
        <div className="absolute bottom-4 left-4 z-20">
          <CADViewControls />
        </div>

        {/* Left Side Scene Tree */}
        <div className="absolute top-20 left-4 z-20 hidden md:block">
          <CADTree />
        </div>

        {/* Right Side Dimension & Transform Inspector */}
        <div className="absolute top-20 right-4 z-20 hidden md:block">
          <CADInspector />
        </div>

        {/* Measurement calipers overlay */}
        <div className="absolute bottom-24 right-4 z-20 hidden md:block">
          <CADMeasure />
        </div>

        {/* 2D drafting overlay (XZ plane → extrusion) */}
        <div className="absolute bottom-4 right-4 z-20 hidden md:block">
          <CADDraftingOverlay />
        </div>
      </div>

      {/* Modals */}
      <FileDialog isOpen={isFileOpen} onClose={() => setIsFileOpen(false)} />
    </div>
  );
}
