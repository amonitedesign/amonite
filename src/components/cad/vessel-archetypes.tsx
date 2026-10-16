'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { useCADStore } from '@/store/cad-store';
import { STUDIO_THEME } from '@/lib/studio-theme';
import { VESSEL_ARCHETYPES, vesselProfileRadius } from '@/lib/vessel-geometry';
import type { VesselArchetype } from '@/lib/cad-types';

const ORDER: VesselArchetype[] = [
  'fluted-vase',
  'brutalist-planter',
  'organic-bowl',
  'twisted-cylinder',
  'globe-bud',
  'bobbin-teardrop',
  'hourglass-cinch',
  'scallop-channel',
  'nordic-floor',
  'onion-bud',
];

function Silhouette({ archetype, active }: { archetype: VesselArchetype; active: boolean }) {
  const theme = useCADStore((s) => s.settings.theme);
  const t = STUDIO_THEME[theme].chrome;
  const W = 64;
  const H = 76;
  const pts: string[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const v = i / N;
    const r = vesselProfileRadius(archetype, v);
    pts.push(`${W / 2 + r * 25},${H - 6 - v * (H - 12)}`);
  }
  // Mirror down the other side to close the silhouette.
  const mirrored = [...pts].reverse().map((p) => {
    const [x, y] = p.split(',').map(Number);
    return `${W - x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-12 w-10 shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${archetype}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.accent} stopOpacity={active ? '0.35' : '0.1'} />
          <stop offset="100%" stopColor={t.accent} stopOpacity={active ? '0.05' : '0'} />
        </linearGradient>
      </defs>
      <polygon
        points={[...pts, ...mirrored].join(' ')}
        fill={`url(#grad-${archetype})`}
        stroke={active ? t.accentStrong : t.inkFaint}
        strokeWidth={active ? 1.75 : 1.25}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VesselArchetypes(): React.JSX.Element {
  const vesselId = useCADStore((s) => s.vesselId);
  const nodes = useCADStore((s) => s.nodes);
  const setVesselArchetype = useCADStore((s) => s.setVesselArchetype);
  const theme = useCADStore((s) => s.settings.theme);
  const t = STUDIO_THEME[theme].chrome;

  const vessel = nodes.find((n) => n.id === vesselId);
  const active = vessel?.vessel?.archetype ?? 'fluted-vase';

  return (
    <div className="flex h-full w-full flex-col font-mono select-none">
      {/* Sidebar Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3 shrink-0"
        style={{ borderColor: t.hairline }}
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" style={{ color: t.accent }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: t.ink }}
          >
            Base forms
          </span>
        </div>
        <span
          className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded font-mono"
          style={{ backgroundColor: `${t.accent}1f`, color: t.accentSoft }}
        >
          {ORDER.length} forms
        </span>
      </div>

      {/* Archetypes List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 [scrollbar-width:thin]">
        {ORDER.map((key) => {
          const spec = VESSEL_ARCHETYPES[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVesselArchetype(key)}
              aria-pressed={isActive}
              className="group flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-all"
              style={
                isActive
                  ? {
                      backgroundColor: `${t.accent}1f`,
                      borderColor: `${t.accent}80`,
                    }
                  : {
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = t.wellBg;
                  e.currentTarget.style.borderColor = t.hairline;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <Silhouette archetype={key} active={isActive} />
              <div className="min-w-0 flex-1">
                <span
                  className="block text-xs font-bold tracking-tight truncate font-display"
                  style={{ color: isActive ? t.ink : t.inkSoft }}
                >
                  {spec.label}
                </span>
                <span
                  className="mt-0.5 block text-[10px] leading-3.5 line-clamp-2"
                  style={{ color: t.inkFaint }}
                >
                  {spec.blurb}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
