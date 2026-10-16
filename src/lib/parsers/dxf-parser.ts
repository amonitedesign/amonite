import { CADNode } from '../cad-types';

/**
 * Generates an AutoCAD ASCII DXF file representation of the scene's bounding edges and geometry.
 */
export function exportToDXF(nodes: CADNode[]): Blob {
  let dxf = '';

  // HEADER section
  dxf += '0\nSECTION\n2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1009\n'; // AutoCAD R12 ASCII DXF standard for maximum cross-compatibility
  dxf += '9\n$INSUNITS\n70\n4\n'; // 4 = Millimeters
  dxf += '0\nENDSEC\n';

  // TABLES section
  dxf += '0\nSECTION\n2\nTABLES\n';
  dxf += '0\nTABLE\n2\nLAYER\n70\n1\n';
  dxf += '0\nLAYER\n2\nAMONITE_GEOMETRY\n70\n0\n62\n7\n6\nCONTINUOUS\n';
  dxf += '0\nENDTAB\n';
  dxf += '0\nENDSEC\n';

  // BLOCKS section
  dxf += '0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n';

  // ENTITIES section
  dxf += '0\nSECTION\n2\nENTITIES\n';

  nodes.forEach((node) => {
    if (!node.visible) return;
    const px = node.position.x;
    const py = node.position.y;
    const pz = node.position.z;

    if (node.type === 'box') {
      const w = (node.dimensions.width || 40) / 2;
      const h = (node.dimensions.height || 40) / 2;
      const d = (node.dimensions.depth || 40) / 2;

      // Add 12 line edges of the 3D cuboid
      const vertices = [
        [px - w, py - h, pz - d],
        [px + w, py - h, pz - d],
        [px + w, py + h, pz - d],
        [px - w, py + h, pz - d],
        [px - w, py - h, pz + d],
        [px + w, py - h, pz + d],
        [px + w, py + h, pz + d],
        [px - w, py + h, pz + d],
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // bottom
        [4, 5], [5, 6], [6, 7], [7, 4], // top
        [0, 4], [1, 5], [2, 6], [3, 7], // uprights
      ];

      edges.forEach(([start, end]) => {
        dxf += '0\nLINE\n8\nAMONITE_GEOMETRY\n';
        dxf += `10\n${vertices[start][0].toFixed(4)}\n20\n${vertices[start][1].toFixed(4)}\n30\n${vertices[start][2].toFixed(4)}\n`;
        dxf += `11\n${vertices[end][0].toFixed(4)}\n21\n${vertices[end][1].toFixed(4)}\n31\n${vertices[end][2].toFixed(4)}\n`;
      });
    } else if (node.type === 'cylinder') {
      const r = node.dimensions.radius || 20;
      const h = (node.dimensions.height || 40) / 2;
      const segs = 16;
      for (let i = 0; i < segs; i++) {
        const theta1 = (i / segs) * Math.PI * 2;
        const theta2 = ((i + 1) / segs) * Math.PI * 2;

        const x1 = px + r * Math.cos(theta1);
        const z1 = pz + r * Math.sin(theta1);
        const x2 = px + r * Math.cos(theta2);
        const z2 = pz + r * Math.sin(theta2);

        // Bottom ring
        dxf += `0\nLINE\n8\nAMONITE_GEOMETRY\n10\n${x1.toFixed(4)}\n20\n${(py - h).toFixed(4)}\n30\n${z1.toFixed(4)}\n11\n${x2.toFixed(4)}\n21\n${(py - h).toFixed(4)}\n31\n${z2.toFixed(4)}\n`;
        // Top ring
        dxf += `0\nLINE\n8\nAMONITE_GEOMETRY\n10\n${x1.toFixed(4)}\n20\n${(py + h).toFixed(4)}\n30\n${z1.toFixed(4)}\n11\n${x2.toFixed(4)}\n21\n${(py + h).toFixed(4)}\n31\n${z2.toFixed(4)}\n`;
        // Vertical struts
        if (i % 4 === 0) {
          dxf += `0\nLINE\n8\nAMONITE_GEOMETRY\n10\n${x1.toFixed(4)}\n20\n${(py - h).toFixed(4)}\n30\n${z1.toFixed(4)}\n11\n${x1.toFixed(4)}\n21\n${(py + h).toFixed(4)}\n31\n${z1.toFixed(4)}\n`;
        }
      }
    } else if (node.type === 'vessel' && node.vessel) {
      // Vessel footprint: base ring + rim ring for contractor layouts.
      const r = node.vessel.baseRadius;
      const h = node.vessel.height;
      const segs = 24;
      for (let i = 0; i < segs; i++) {
        const theta1 = (i / segs) * Math.PI * 2;
        const theta2 = ((i + 1) / segs) * Math.PI * 2;
        const x1 = px + r * Math.cos(theta1);
        const z1 = pz + r * Math.sin(theta1);
        const x2 = px + r * Math.cos(theta2);
        const z2 = pz + r * Math.sin(theta2);
        dxf += `0\nLINE\n8\nAMONITE_GEOMETRY\n10\n${x1.toFixed(4)}\n20\n${py.toFixed(4)}\n30\n${z1.toFixed(4)}\n11\n${x2.toFixed(4)}\n21\n${py.toFixed(4)}\n31\n${z2.toFixed(4)}\n`;
        dxf += `0\nLINE\n8\nAMONITE_GEOMETRY\n10\n${x1.toFixed(4)}\n20\n${(py + h).toFixed(4)}\n30\n${z1.toFixed(4)}\n11\n${x2.toFixed(4)}\n21\n${(py + h).toFixed(4)}\n31\n${z2.toFixed(4)}\n`;
      }
    } else {
      // Generic coordinate cross / marker
      dxf += `0\nPOINT\n8\nAMONITE_GEOMETRY\n10\n${px.toFixed(4)}\n20\n${py.toFixed(4)}\n30\n${pz.toFixed(4)}\n`;
    }
  });

  dxf += '0\nENDSEC\n0\nEOF\n';
  return new Blob([dxf], { type: 'application/dxf;charset=utf-8' });
}

/**
 * Parses ASCII DXF text into a list of 2D coordinates for polygon extrusion.
 */
export function parseDXF(content: string): { x: number; y: number }[] {
  const lines = content.split(/\r?\n/);
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === 'LINE' || line === 'POINT') {
      let x: number | null = null;
      let y: number | null = null;

      while (i < lines.length - 1) {
        i++;
        const code = lines[i].trim();
        const val = lines[i + 1]?.trim();
        if (code === '0') {
          i--;
          break;
        }
        if (code === '10' && val !== undefined) x = parseFloat(val);
        if (code === '20' && val !== undefined) y = parseFloat(val);
        i++;
      }

      if (x !== null && y !== null && !isNaN(x) && !isNaN(y)) {
        points.push({ x, y });
      }
    }
  }

  // Fallback defaults if no valid line entities
  if (points.length < 3) {
    return [
      { x: -25, y: -25 },
      { x: 25, y: -25 },
      { x: 25, y: 25 },
      { x: -25, y: 25 },
    ];
  }

  return points;
}
