'use client';

import React from 'react';
import { useCADStore } from '@/store/cad-store';
import { VESSEL_ARCHETYPES, vesselProfileRadius } from '@/lib/vessel-geometry';
import type { VesselArchetype } from '@/lib/cad-types';

const ORDER: VesselArchetype[] = [
  'fluted-vase',
  'brutalist-planter',
  'organic-bowl',
  'twisted-cylinder',
];

function Silhouette({ archetype, active }: { archetype: VesselArchetype; active: boolean }) {
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
      className="h-14 w-12 shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-${archetype}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c96f4b" stopOpacity={active ? '0.35' : '0.1'} />
          <stop offset="100%" stopColor="#c96f4b" stopOpacity={active ? '0.05' : '0'} />
        </linearGradient>
      </defs>
      <polygon
        points={[...pts, ...mirrored].join(' ')}
        fill={`url(#grad-${archetype})`}
        stroke={active ? '#d98560' : '#8a8071'}
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

  const vessel = nodes.find((n) => n.id === vesselId);
  const active = vessel?.vessel?.archetype ?? 'fluted-vase';

  return (
    <div className="w-60 rounded-xl border border-white/[0.07] bg-[#1e1a15]/95 p-3 shadow-2xl backdrop-blur-md max-h-[calc(100vh-148px)] overflow-y-auto">
      <p className="px-1 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a89e8d]">
        Base forms
      </p>
      <div className="flex flex-col gap-1.5">
        {ORDER.map((key) => {
          const spec = VESSEL_ARCHETYPES[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVesselArchetype(key)}
              aria-pressed={isActive}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                isActive
                  ? 'bg-[#c96f4b]/10 outline outline-1 outline-[#c96f4b]/40'
                  : 'hover:bg-white/[0.04]'
              }`}
            >
              <Silhouette archetype={key} active={isActive} />
              <span>
                <span className={`block text-[13px] font-semibold ${isActive ? 'text-[#f2e9d8]' : 'text-[#d8cfbd]'}`}>
                  {spec.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-[#8a8071]">
                  {spec.blurb}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
