import { AmoniteProject, CADNode, ViewportState, DEFAULT_STUDIO_SETTINGS, StudioSettings } from './cad-types';

const STORAGE_KEY = 'amonite_cad_workspace_autosave';
const SETTINGS_KEY = 'amonite-studio-settings';

export function saveWorkspaceLocally(nodes: CADNode[], viewport: ViewportState) {
  if (typeof window === 'undefined') return;
  try {
    const data: AmoniteProject = {
      version: '1.0.0',
      id: 'local-session',
      title: 'Auto-saved Workspace',
      created: Date.now(),
      updated: Date.now(),
      viewport,
      nodes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export function loadWorkspaceLocally(): AmoniteProject | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as AmoniteProject;
  } catch (err) {
    console.warn('Failed to load from localStorage:', err);
    return null;
  }
}

export function clearWorkspaceLocally() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function saveStudioSettings(settings: StudioSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save studio settings:', err);
  }
}

export function loadStudioSettings(): StudioSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_STUDIO_SETTINGS };
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return { ...DEFAULT_STUDIO_SETTINGS };
    return { ...DEFAULT_STUDIO_SETTINGS, ...(JSON.parse(saved) as Partial<StudioSettings>) };
  } catch (err) {
    console.warn('Failed to load studio settings:', err);
    return { ...DEFAULT_STUDIO_SETTINGS };
  }
}

/** Approximate bytes consumed by Amonite keys in localStorage. */
export function studioStorageBytes(): number {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  for (const key of [STORAGE_KEY, SETTINGS_KEY]) {
    try {
      total += (localStorage.getItem(key) ?? '').length;
    } catch {
      // storage unavailable — report what we have
    }
  }
  return total;
}
