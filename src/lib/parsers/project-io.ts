import { AmoniteProject, CADNode, ViewportState } from '../cad-types';

export function createProjectJSON(
  nodes: CADNode[],
  viewport: ViewportState,
  title = 'Untitled CAD Project'
): Blob {
  const project: AmoniteProject = {
    version: '1.0.0',
    id: `amonite-proj-${Date.now()}`,
    title,
    created: Date.now(),
    updated: Date.now(),
    viewport,
    nodes,
  };

  const json = JSON.stringify(project, null, 2);
  return new Blob([json], { type: 'application/json;charset=utf-8' });
}

export function parseProjectJSON(content: string): AmoniteProject {
  const parsed = JSON.parse(content);
  if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
    throw new Error('Invalid Amonite Project file: missing nodes array');
  }
  return parsed as AmoniteProject;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
