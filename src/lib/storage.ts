import { AmoniteProject, CADNode, ViewportState } from './cad-types';

const STORAGE_KEY = 'amonite_cad_workspace_autosave';

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
