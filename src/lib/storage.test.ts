import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearWorkspaceLocally, loadStudioSettings, loadWorkspaceLocally, saveStudioSettings, saveWorkspaceLocally, studioStorageBytes } from './storage';
import type { CADNode, ViewportState } from './cad-types';
import { DEFAULT_STUDIO_SETTINGS } from './cad-types';

const viewport: ViewportState = {
  cameraMode: 'perspective',
  renderStyle: 'shaded',
  gridVisible: true,
  gridSize: 200,
  gridDivisions: 40,
  snapToGrid: true,
  snapStep: 5,
  unit: 'mm',
};

const nodes: CADNode[] = [
  {
    id: 'n1',
    name: 'Base Plate',
    type: 'box',
    position: { x: 0, y: 5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: { width: 60, height: 10, depth: 60 },
    color: '#38bdf8',
    visible: true,
    wireframe: false,
  },
];

function installLocalStorageMock() {
  let store: Record<string, string> = {};
  const localStorageMock = {
    getItem: vi.fn((k: string) => store[k] ?? null),
    setItem: vi.fn((k: string, v: string) => {
      store[k] = v;
    }),
    removeItem: vi.fn((k: string) => {
      delete store[k];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
  vi.stubGlobal('window', { localStorage: localStorageMock });
  vi.stubGlobal('localStorage', localStorageMock);
  return localStorageMock;
}

describe('storage / local autosave', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('no-ops during SSR (no window)', () => {
    expect(saveWorkspaceLocally(nodes, viewport)).toBeUndefined();
    expect(loadWorkspaceLocally()).toBeNull();
    expect(clearWorkspaceLocally()).toBeUndefined();
  });

  it('round-trips nodes + viewport through localStorage', () => {
    installLocalStorageMock();
    saveWorkspaceLocally(nodes, viewport);
    const loaded = loadWorkspaceLocally();
    expect(loaded).not.toBeNull();
    expect(loaded!.nodes).toEqual(nodes);
    expect(loaded!.viewport).toEqual(viewport);
    expect(loaded!.version).toBe('1.0.0');
  });

  it('clear removes the autosave key', () => {
    const ls = installLocalStorageMock();
    saveWorkspaceLocally(nodes, viewport);
    clearWorkspaceLocally();
    expect(ls.removeItem).toHaveBeenCalledWith('amonite_cad_workspace_autosave');
    expect(loadWorkspaceLocally()).toBeNull();
  });

  it('returns null on corrupt JSON instead of throwing', () => {
    const ls = installLocalStorageMock();
    ls.getItem.mockReturnValueOnce('{{{not-json');
    expect(loadWorkspaceLocally()).toBeNull();
  });

  it('warns (not throws) when quota is exceeded', () => {
    const ls = installLocalStorageMock();
    ls.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => saveWorkspaceLocally(nodes, viewport)).not.toThrow();
  });
});

describe('storage / studio settings', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns defaults when nothing is stored', () => {
    installLocalStorageMock();
    expect(loadStudioSettings()).toEqual(DEFAULT_STUDIO_SETTINGS);
  });

  it('round-trips settings and merges over defaults', () => {
    installLocalStorageMock();
    saveStudioSettings({ ...DEFAULT_STUDIO_SETTINGS, theme: 'light', rotateSpeed: 1.5 });
    expect(loadStudioSettings()).toEqual({ ...DEFAULT_STUDIO_SETTINGS, theme: 'light', rotateSpeed: 1.5 });
  });

  it('falls back to defaults on corrupt JSON', () => {
    const ls = installLocalStorageMock();
    ls.getItem.mockReturnValueOnce('{{{not-json');
    expect(loadStudioSettings()).toEqual(DEFAULT_STUDIO_SETTINGS);
  });

  it('reports bytes used across amonite keys', () => {
    installLocalStorageMock();
    saveWorkspaceLocally(nodes, viewport);
    saveStudioSettings(DEFAULT_STUDIO_SETTINGS);
    expect(studioStorageBytes()).toBeGreaterThan(100);
  });
});
