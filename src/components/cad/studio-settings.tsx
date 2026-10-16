'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Settings, Sun } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { STUDIO_THEME } from '@/lib/studio-theme';
import { studioStorageBytes } from '@/lib/storage';
import type { StudioThemeMode } from '@/lib/cad-types';

function SectionLabel({ children }: { children: React.ReactNode }) {
  const theme = useCADStore((s) => s.settings.theme);
  const t = STUDIO_THEME[theme].chrome;
  return (
    <p
      className="px-1 pb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: t.inkFaint }}
    >
      {children}
    </p>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useCADStore((s) => s.settings.theme);
  const t = STUDIO_THEME[theme].chrome;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors"
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.wellBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <span>
        <span className="block text-xs" style={{ color: t.inkSoft }}>{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[10px]" style={{ color: t.inkFaint }}>{hint}</span>
        )}
      </span>
      <span
        className="relative h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ backgroundColor: checked ? t.accent : 'rgba(128,120,105,0.35)' }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? '18px' : '2px' }}
        />
      </span>
    </button>
  );
}

export default function StudioSettings(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const theme = useCADStore((s) => s.settings.theme);
  const settings = useCADStore((s) => s.settings);
  const unit = useCADStore((s) => s.viewport.unit);
  const setStudioTheme = useCADStore((s) => s.setStudioTheme);
  const setSetting = useCADStore((s) => s.setSetting);
  const setViewport = useCADStore((s) => s.setViewport);
  const resetVesselShape = useCADStore((s) => s.resetVesselShape);
  const t = STUDIO_THEME[theme].chrome;
  // Cheap synchronous read, evaluated only while the panel is open.
  const storedKB = open ? (studioStorageBytes() / 1024).toFixed(1) : '0.0';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  const setMode = (mode: StudioThemeMode) => setStudioTheme(mode);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Studio settings"
        title="Studio settings"
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors"
        style={{ color: t.inkMute }}
        onMouseEnter={(e) => { e.currentTarget.style.color = t.ink; e.currentTarget.style.backgroundColor = t.wellBg; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = t.inkMute; e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Settings className="h-4 w-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close settings"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default bg-transparent"
          />
          <div
            role="dialog"
            aria-label="Studio settings"
            className="absolute right-0 top-10 z-40 max-h-[calc(100vh-120px)] w-72 overflow-y-auto rounded-xl border p-3 shadow-2xl backdrop-blur-md"
            style={{ backgroundColor: t.panelBg, borderColor: t.hairline }}
          >
            {/* Appearance */}
            <SectionLabel>Appearance</SectionLabel>
            <div
              className="grid grid-cols-2 gap-1 rounded-lg p-1"
              style={{ backgroundColor: t.wellBg }}
              role="group"
              aria-label="Studio theme"
            >
              {(
                [
                  { mode: 'dark' as const, label: 'Dark atelier', Icon: Moon },
                  { mode: 'light' as const, label: 'Light paper', Icon: Sun },
                ]
              ).map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setMode(mode)}
                  aria-pressed={theme === mode}
                  className="flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] transition-colors"
                  style={
                    theme === mode
                      ? { backgroundColor: `${t.accent}26`, color: t.ink, outline: `1px solid ${t.accent}66` }
                      : { color: t.inkMute }
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Turntable & stage */}
            <div className="pt-3">
              <SectionLabel>Turntable & stage</SectionLabel>
              <Toggle
                label="Turntable rotation"
                hint="Slow showcase spin"
                checked={settings.autoRotate}
                onChange={(v) => setSetting('autoRotate', v)}
              />
              <div className="px-2 py-1.5">
                <span className="flex items-baseline justify-between">
                  <span className="text-xs" style={{ color: t.inkSoft }}>Spin speed</span>
                  <span className="font-mono text-[11px]" style={{ color: t.inkMute }}>
                    {settings.rotateSpeed.toFixed(2)}×
                  </span>
                </span>
                <input
                  type="range"
                  min={0.25}
                  max={2}
                  step={0.25}
                  value={settings.rotateSpeed}
                  onChange={(e) => setSetting('rotateSpeed', Number(e.target.value))}
                  aria-label="Turntable speed"
                  className="mt-1.5 w-full accent-[#c96f4b]"
                />
              </div>
              <Toggle
                label="Display pedestal"
                hint="The plinth under the piece"
                checked={settings.pedestalVisible}
                onChange={(v) => setSetting('pedestalVisible', v)}
              />
              <Toggle
                label="Soft shadows"
                hint="Gallery floor shading"
                checked={settings.shadowsEnabled}
                onChange={(v) => setSetting('shadowsEnabled', v)}
              />
            </div>

            {/* Units */}
            <div className="pt-3">
              <SectionLabel>Units</SectionLabel>
              <div
                className="grid grid-cols-2 gap-1 rounded-lg p-1"
                style={{ backgroundColor: t.wellBg }}
                role="group"
                aria-label="Display units"
              >
                {(
                  [
                    { value: 'mm' as const, label: 'Millimetres' },
                    { value: 'in' as const, label: 'Inches' },
                  ]
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setViewport({ unit: value })}
                    aria-pressed={unit === value}
                    className="rounded-md px-2 py-1.5 text-[11px] transition-colors"
                    style={
                      unit === value
                        ? { backgroundColor: `${t.accent}26`, color: t.ink, outline: `1px solid ${t.accent}66` }
                        : { color: t.inkMute }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Workshop */}
            <div className="pt-3">
              <SectionLabel>Workshop</SectionLabel>
              <Toggle
                label="Autosave"
                hint="Keep the piece in this browser"
                checked={settings.autosaveEnabled}
                onChange={(v) => setSetting('autosaveEnabled', v)}
              />
              <button
                type="button"
                onClick={resetVesselShape}
                className="mt-1 w-full rounded-lg px-2 py-2 text-left text-xs transition-colors"
                style={{ color: t.inkSoft }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.wellBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Reset shape to archetype
              </button>
              <p className="px-2 pt-1 font-mono text-[10px]" style={{ color: t.inkFaint }}>
                Local storage in use · {storedKB} KB
              </p>
            </div>

            {/* About */}
            <div className="pt-3">
              <SectionLabel>About</SectionLabel>
              <div className="flex items-center justify-between px-2 py-1 text-[11px]" style={{ color: t.inkMute }}>
                <span>Amonite Atelier · v0.1</span>
                <span className="flex gap-3">
                  <Link href="/docs" className="underline" style={{ color: t.inkSoft }}>Docs</Link>
                  <Link href="/pricing" className="underline" style={{ color: t.inkSoft }}>Pro</Link>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
