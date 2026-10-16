import { CADNode } from '../cad-types';

/**
 * Generates an SVG 2D orthographic projection diagram of the active scene.
 */
export function exportToSVG(nodes: CADNode[], width = 800, height = 600): Blob {
  const cx = width / 2;
  const cy = height / 2;
  const scale = 2.0;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
  svg += `  <style>\n`;
  svg += `    .bg { fill: #0a0b0d; }\n`;
  svg += `    .grid { stroke: #1e2430; stroke-width: 0.5; }\n`;
  svg += `    .axis { stroke: #3b82f6; stroke-width: 1.5; }\n`;
  svg += `    .cad-geom { stroke: #00e5ff; fill: rgba(0, 229, 255, 0.15); stroke-width: 1.5; }\n`;
  svg += `    .text { font-family: 'Inter', monospace; font-size: 11px; fill: #64748b; }\n`;
  svg += `  </style>\n`;

  // Background
  svg += `  <rect width="100%" height="100%" class="bg" />\n`;

  // Grid
  const step = 20;
  for (let x = 0; x <= width; x += step) {
    svg += `  <line x1="${x}" y1="0" x2="${x}" y2="${height}" class="grid" />\n`;
  }
  for (let y = 0; y <= height; y += step) {
    svg += `  <line x1="0" y1="${y}" x2="${width}" y2="${y}" class="grid" />\n`;
  }

  // Axes
  svg += `  <line x1="0" y1="${cy}" x2="${width}" y2="${cy}" class="axis" />\n`;
  svg += `  <line x1="${cx}" y1="0" x2="${cx}" y2="${height}" class="axis" />\n`;

  // Geometry
  nodes.forEach((node) => {
    if (!node.visible) return;
    const nx = cx + node.position.x * scale;
    const nz = cy + node.position.z * scale; // top view X-Z plane

    if (node.type === 'box') {
      const w = (node.dimensions.width || 40) * scale;
      const d = (node.dimensions.depth || 40) * scale;
      svg += `  <rect x="${nx - w / 2}" y="${nz - d / 2}" width="${w}" height="${d}" class="cad-geom" rx="2" />\n`;
      svg += `  <text x="${nx - w / 2 + 5}" y="${nz - d / 2 + 14}" class="text">${node.name}</text>\n`;
    } else if (node.type === 'cylinder' || node.type === 'sphere') {
      const r = (node.dimensions.radius || 20) * scale;
      svg += `  <circle cx="${nx}" cy="${nz}" r="${r}" class="cad-geom" />\n`;
      svg += `  <text x="${nx - r + 5}" y="${nz}" class="text">${node.name}</text>\n`;
    } else {
      svg += `  <circle cx="${nx}" cy="${nz}" r="12" class="cad-geom" />\n`;
      svg += `  <text x="${nx + 15}" y="${nz + 4}" class="text">${node.name}</text>\n`;
    }
  });

  svg += `</svg>\n`;
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

/**
 * Extracts 2D polyline points from an imported SVG file string.
 */
export function parseSVGPaths(svgContent: string): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];

  // Simple regex parser for SVG polyline or polygon coordinates
  const polyMatch = svgContent.match(/points=["']([^"']+)["']/);
  if (polyMatch && polyMatch[1]) {
    const rawCoords = polyMatch[1].trim().split(/[\s,]+/);
    for (let i = 0; i < rawCoords.length; i += 2) {
      const x = parseFloat(rawCoords[i]);
      const y = parseFloat(rawCoords[i + 1]);
      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x: x - 50, y: y - 50 });
      }
    }
  }

  if (points.length < 3) {
    // Default star polygon
    const numPoints = 6;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = i % 2 === 0 ? 30 : 15;
      points.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }
  }

  return points;
}
