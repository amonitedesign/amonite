'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  dimensions: {
    height: string;
    diameter: string;
    wall: string;
  };
  fabrication: {
    printTime: string;
    weight: string;
    material: string;
    nozzle: string;
    slicerMode: string;
    shrinkage: string;
  };
  palette: {
    name: string;
    accent: string;
    surfaceBg: string;
  };
  svgSilhouette: React.ReactNode;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'fluted-vase',
    name: 'Fluted Ikebana Vessel',
    tagline: '18 harmonic vertical flutes with gentle neck taper',
    category: 'Vases & Vessels',
    description:
      'Inspired by Japanese ceremonial ikebana ceramics. The subtle concave neck constriction supports single stems, while 18 exterior flutes create dynamic shadow-play under ambient light.',
    dimensions: {
      height: '210 mm',
      diameter: '95 mm base / 32 mm rim',
      wall: '1.2 mm continuous wall',
    },
    fabrication: {
      printTime: '1h 48m',
      weight: '82 g',
      material: 'Bisque Stoneware PLA',
      nozzle: '0.4 mm brass',
      slicerMode: 'Vase Mode (Spiralize Outer Contour)',
      shrinkage: '+12.0% Kiln Factor',
    },
    palette: {
      name: 'Chalk Stoneware',
      accent: '#c28456',
      surfaceBg: '#eae6dc',
    },
    svgSilhouette: (
      <svg viewBox="0 0 200 280" className="w-full h-full max-h-72 drop-shadow-md">
        {/* Fluted Vase Contour */}
        <defs>
          <linearGradient id="stonewareGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d8d2c4" />
            <stop offset="35%" stopColor="#f3efe6" />
            <stop offset="70%" stopColor="#cfc8b8" />
            <stop offset="100%" stopColor="#b3ac9c" />
          </linearGradient>
        </defs>
        {/* Base foot */}
        <ellipse cx="100" cy="255" rx="38" ry="8" fill="#a49d8c" />
        {/* Main Body */}
        <path
          d="M 62 255 C 55 210, 48 140, 72 90 C 80 75, 82 55, 78 35 C 78 32, 122 32, 122 35 C 118 55, 120 75, 128 90 C 152 140, 145 210, 138 255 Z"
          fill="url(#stonewareGrad)"
          stroke="#8c8474"
          strokeWidth="1.2"
        />
        {/* Fluted vertical rib lines */}
        <path d="M 80 35 C 82 55, 84 75, 88 110 C 92 160, 88 220, 84 255" fill="none" stroke="#b0a898" strokeWidth="1" strokeDasharray="2 1" />
        <path d="M 93 33 C 94 55, 96 75, 98 110 C 100 160, 98 220, 96 256" fill="none" stroke="#7e7666" strokeWidth="1.2" />
        <path d="M 107 33 C 106 55, 104 75, 102 110 C 100 160, 102 220, 104 256" fill="none" stroke="#7e7666" strokeWidth="1.2" />
        <path d="M 120 35 C 118 55, 116 75, 112 110 C 108 160, 112 220, 116 255" fill="none" stroke="#b0a898" strokeWidth="1" strokeDasharray="2 1" />
        {/* Rim opening */}
        <ellipse cx="100" cy="35" rx="22" ry="5" fill="#f6f3eb" stroke="#8c8474" strokeWidth="1.2" />
        <ellipse cx="100" cy="35" rx="17" ry="3.5" fill="#585246" />
      </svg>
    ),
  },
  {
    id: 'ribbed-planter',
    name: 'Ribbed Nordic Planter',
    tagline: 'Horizontal cooling ribs with integrated moisture barrier',
    category: 'Planters & Botanicals',
    description:
      'Engineered for indoor flora. The stepped horizontal ribbing provides structural rigidity to withstand potting soil pressure while serving as an ergonomic grip surface.',
    dimensions: {
      height: '140 mm',
      diameter: '160 mm base / 175 mm rim',
      wall: '2.8 mm reinforced wall',
    },
    fabrication: {
      printTime: '3h 15m',
      weight: '210 g',
      material: 'Matte Terracotta Ceramic',
      nozzle: '0.6 mm high-flow',
      slicerMode: 'Watertight Shell (3 perimeters)',
      shrinkage: '+10.5% Kiln Factor',
    },
    palette: {
      name: 'Matte Terracotta',
      accent: '#c26d4a',
      surfaceBg: '#ecdcd4',
    },
    svgSilhouette: (
      <svg viewBox="0 0 200 280" className="w-full h-full max-h-72 drop-shadow-md">
        <defs>
          <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a85232" />
            <stop offset="30%" stopColor="#d97550" />
            <stop offset="70%" stopColor="#bf5f3b" />
            <stop offset="100%" stopColor="#8c3e24" />
          </linearGradient>
        </defs>
        {/* Planter Body */}
        <path
          d="M 45 240 L 32 80 L 168 80 L 155 240 Z"
          fill="url(#terracottaGrad)"
          stroke="#732f18"
          strokeWidth="1.2"
        />
        {/* Horizontal ribs */}
        <line x1="36" y1="110" x2="164" y2="110" stroke="#f09673" strokeWidth="2.5" />
        <line x1="38" y1="140" x2="162" y2="140" stroke="#f09673" strokeWidth="2.5" />
        <line x1="40" y1="170" x2="160" y2="170" stroke="#f09673" strokeWidth="2.5" />
        <line x1="42" y1="200" x2="158" y2="200" stroke="#f09673" strokeWidth="2.5" />
        {/* Top Rim */}
        <ellipse cx="100" cy="80" rx="68" ry="12" fill="#e07e59" stroke="#732f18" strokeWidth="1.2" />
        <ellipse cx="100" cy="80" rx="58" ry="9" fill="#4d1e0f" />
        {/* Base */}
        <ellipse cx="100" cy="240" rx="55" ry="9" fill="#732f18" />
      </svg>
    ),
  },
  {
    id: 'organic-bowl',
    name: 'Pleated Wave Bowl',
    tagline: '12-wave undulating rim with stable foot ring',
    category: 'Centerpieces & Tableware',
    description:
      'A low-profile decorative bowl featuring continuous trigonometric wave ripples. Slices effortlessly without supports and creates an organic centerpiece for fruits or dry decor.',
    dimensions: {
      height: '85 mm',
      diameter: '90 mm base / 240 mm rim',
      wall: '1.8 mm watertight wall',
    },
    fabrication: {
      printTime: '2h 05m',
      weight: '145 g',
      material: 'Bisque White Porcelain',
      nozzle: '0.4 mm brass',
      slicerMode: 'Continuous Spiralize (Vase Mode)',
      shrinkage: '+14.2% Kiln Factor',
    },
    palette: {
      name: 'Bisque White',
      accent: '#a8a194',
      surfaceBg: '#f2f0ea',
    },
    svgSilhouette: (
      <svg viewBox="0 0 200 280" className="w-full h-full max-h-72 drop-shadow-md">
        <defs>
          <linearGradient id="porcelainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dedbd3" />
            <stop offset="40%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#ebe7de" />
            <stop offset="100%" stopColor="#c8c3b7" />
          </linearGradient>
        </defs>
        {/* Bowl flare */}
        <path
          d="M 68 215 C 60 195, 20 150, 15 130 C 50 120, 150 120, 185 130 C 180 150, 140 195, 132 215 Z"
          fill="url(#porcelainGrad)"
          stroke="#948e81"
          strokeWidth="1.2"
        />
        {/* Fluted waves on lip */}
        <path
          d="M 15 130 Q 35 142, 55 130 Q 75 142, 95 130 Q 115 142, 135 130 Q 155 142, 175 130 Q 185 132, 185 130"
          fill="none"
          stroke="#b8b2a3"
          strokeWidth="2"
        />
        {/* Foot ring */}
        <ellipse cx="100" cy="215" rx="32" ry="6" fill="#8c8677" />
      </svg>
    ),
  },
  {
    id: 'twisted-lamp',
    name: 'Twisted Biophilic Lamp Shell',
    tagline: '60° helical rib rotation with diffused transmission',
    category: 'Lighting & Pendants',
    description:
      'A helical lampshade shell engineered for E26/E27 light sockets. The 60-degree rotational twist diffuses the interior light source into soft ambient gradients along the wall.',
    dimensions: {
      height: '260 mm',
      diameter: '180 mm base / 110 mm top',
      wall: '0.8 mm translucent shell',
    },
    fabrication: {
      printTime: '2h 40m',
      weight: '115 g',
      material: 'Translucent Smoked PETG',
      nozzle: '0.8 mm high-flow',
      slicerMode: 'Single Perimeter Vase Mode',
      shrinkage: '0.0% (Polymer)',
    },
    palette: {
      name: 'Smoked Obsidian',
      accent: '#6366f1',
      surfaceBg: '#212026',
    },
    svgSilhouette: (
      <svg viewBox="0 0 200 280" className="w-full h-full max-h-72 drop-shadow-md">
        <defs>
          <linearGradient id="lampGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#303138" />
            <stop offset="45%" stopColor="#565969" />
            <stop offset="75%" stopColor="#3d3f4a" />
            <stop offset="100%" stopColor="#222329" />
          </linearGradient>
        </defs>
        {/* Top Aperture */}
        <ellipse cx="100" cy="45" rx="34" ry="7" fill="#6d7082" stroke="#222329" strokeWidth="1" />
        {/* Twisted shell form */}
        <path
          d="M 66 45 C 50 100, 35 180, 22 250 C 70 262, 130 262, 178 250 C 165 180, 150 100, 134 45 Z"
          fill="url(#lampGrad)"
          stroke="#1e1f24"
          strokeWidth="1.2"
        />
        {/* Helical spiral ribs */}
        <path d="M 72 45 C 65 100, 48 180, 42 255" fill="none" stroke="#7e8399" strokeWidth="1.5" />
        <path d="M 88 46 C 85 105, 78 180, 78 258" fill="none" stroke="#9da2bd" strokeWidth="1.8" />
        <path d="M 104 46 C 105 105, 112 180, 116 258" fill="none" stroke="#9da2bd" strokeWidth="1.8" />
        <path d="M 120 45 C 125 100, 142 180, 152 255" fill="none" stroke="#7e8399" strokeWidth="1.5" />
        {/* Bottom Ring */}
        <ellipse cx="100" cy="254" rx="78" ry="12" fill="none" stroke="#7e8399" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function DesignerShowcase() {
  const [activeId, setActiveId] = useState<string>('fluted-vase');
  const activeItem = SHOWCASE_ITEMS.find((item) => item.id === activeId) || SHOWCASE_ITEMS[0];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[#e6e2da] dark:border-[#262421]">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-[11px] font-mono font-semibold text-[#857d72] dark:text-[#787166] uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c28456] dark:text-[#d4a373]" />
            <span>02 // DESIGNER WORK SHOWCASE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#141311] dark:text-[#f2efe9] tracking-tight">
            Curated objects crafted in Amonite
          </h2>
        </div>
        <p className="text-xs text-[#5e574d] dark:text-[#a8a194] max-w-md leading-relaxed">
          Production blueprints for bespoke vases, planters &amp; lighting. Each design is generated with continuous single-wall toolpaths and kiln-shrinkage compensation.
        </p>
      </div>

      {/* Archetype Tab Rail */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[#e6e2da] dark:border-[#262421] pb-3">
        {SHOWCASE_ITEMS.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#1a1917] text-[#fcfbf9] dark:bg-[#ece8df] dark:text-[#161513] font-bold shadow-sm'
                  : 'bg-transparent text-[#70695e] dark:text-[#948c7e] hover:bg-[#ede9df] dark:hover:bg-[#1f1e1b] hover:text-[#1e1c19] dark:hover:text-[#e4ded4]'
              }`}
            >
              <span className="text-[10px] opacity-60">0{index + 1}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-2xl bg-[#f4f1eb] dark:bg-[#181715] border border-[#e3dfd6] dark:border-[#262421] p-6 sm:p-10">
        
        {/* Left Column: Architectural Blueprint & Maker Telemetry */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Tagline & Category */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#ebe6dc] dark:bg-[#23211d] text-[#6d665b] dark:text-[#9c9486] font-semibold border border-[#ded8cc] dark:border-[#2e2b26]">
                {activeItem.category}
              </span>
              <span className="text-xs text-[#8a8276] dark:text-[#7a7469] font-mono">
                {activeItem.palette.name}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141311] dark:text-[#f2efe9] tracking-tight">
              {activeItem.name}
            </h3>

            {/* Design Narrative */}
            <p className="text-xs sm:text-sm text-[#5e574d] dark:text-[#a8a194] leading-relaxed max-w-xl">
              {activeItem.description}
            </p>
          </div>

          {/* Fabrication Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#e3dfd6] dark:border-[#262421] font-mono">
            <div className="p-3 rounded-lg bg-[#eae6dc] dark:bg-[#1f1d1a] border border-[#ded8cc] dark:border-[#2a2723]">
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-wider font-semibold">HEIGHT</div>
              <div className="text-xs font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">{activeItem.dimensions.height}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#eae6dc] dark:bg-[#1f1d1a] border border-[#ded8cc] dark:border-[#2a2723]">
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-wider font-semibold">DIAMETER</div>
              <div className="text-xs font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">{activeItem.dimensions.diameter}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#eae6dc] dark:bg-[#1f1d1a] border border-[#ded8cc] dark:border-[#2a2723]">
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-wider font-semibold">PRINT DURATION</div>
              <div className="text-xs font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">{activeItem.fabrication.printTime}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#eae6dc] dark:bg-[#1f1d1a] border border-[#ded8cc] dark:border-[#2a2723]">
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-wider font-semibold">MATERIAL WEIGHT</div>
              <div className="text-xs font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5">{activeItem.fabrication.weight}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#eae6dc] dark:bg-[#1f1d1a] border border-[#ded8cc] dark:border-[#2a2723]">
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-wider font-semibold">CLAY SHRINKAGE</div>
              <div className="text-xs font-bold text-[#c28456] dark:text-[#d4a373] mt-0.5">{activeItem.fabrication.shrinkage}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#eae6dc] dark:bg-[#1f1d1a] border border-[#ded8cc] dark:border-[#2a2723]">
              <div className="text-[10px] text-[#857d72] dark:text-[#787166] uppercase tracking-wider font-semibold">SLICING PROFILE</div>
              <div className="text-xs font-bold text-[#1e1c19] dark:text-[#e8e4dc] mt-0.5 truncate" title={activeItem.fabrication.slicerMode}>
                {activeItem.fabrication.slicerMode}
              </div>
            </div>
          </div>

          {/* Action Trigger: Jump straight to Studio with this Archetype */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/sandbox?archetype=${activeItem.id}`}
              className="px-5 py-2.5 rounded-lg bg-[#1a1917] hover:bg-[#2c2a26] text-[#fcfbf9] dark:bg-[#ece8df] dark:hover:bg-[#ffffff] dark:text-[#161513] font-semibold transition-colors flex items-center gap-2 text-xs"
            >
              <span>Customize in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#787166] dark:text-[#8a8276]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#588157]" />
              <span>Watertight STL Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Form Illustration */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#ebe7de] dark:bg-[#131211] border border-[#dfd9cd] dark:border-[#24221f] relative overflow-hidden">
          
          {/* Subtle Ambient Studio Background Ring */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-[#1e1c19] dark:border-[#dcd8d0]" />
          </div>

          {/* SVG Silhouette Graphic */}
          <div className="relative z-10 w-full flex items-center justify-center py-4">
            {activeItem.svgSilhouette}
          </div>

          {/* Caption Tag */}
          <div className="relative z-10 mt-3 flex items-center gap-2 text-[10px] font-mono text-[#70695e] dark:text-[#8a8276] bg-[#dfd9cd]/50 dark:bg-[#1f1e1b]/70 px-3 py-1 rounded-full border border-[#d6cfc2] dark:border-[#2a2824]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeItem.palette.accent }} />
            <span>Parametric Brep &middot; {activeItem.fabrication.material}</span>
          </div>
        </div>

      </div>

    </section>
  );
}
