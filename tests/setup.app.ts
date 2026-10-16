// Tier 2 (app / jsdom) setup — mocks for Next.js + Three.js + browser APIs.
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// --- next/font/google ---
vi.mock('next/font/google', () => ({
  Outfit: () => ({ variable: '--font-sans' }),
  JetBrains_Mono: () => ({ variable: '--font-mono' }),
}));

// --- next/image -> plain img ---
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => React.createElement('img', props),
}));

// --- next/link -> plain anchor ---
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href, ...rest }, children),
}));

// --- three.js control addons (never instantiate WebGL in jsdom) ---
vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(),
}));
vi.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: vi.fn(),
}));

// --- geometry engine: keep logic but avoid heavy three allocs where possible ---
// (individual tests may re-mock per-file with vi.mock)

// --- browser APIs missing in jsdom ---
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

if (!HTMLCanvasElement.prototype.getContext) {
  (HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext = vi.fn().mockReturnValue(null);
}

if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  URL.revokeObjectURL = vi.fn();
}
