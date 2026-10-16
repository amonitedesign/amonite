import * as THREE from 'three';
import { CADNode } from '../cad-types';
import { createGeometryForNode } from '../geometry-engine';

/**
 * Exports CAD nodes to an ASCII or Binary STL file string / ArrayBuffer.
 */
export function exportToSTL(nodes: CADNode[], isBinary = false): Blob {
  if (isBinary) {
    return exportBinarySTL(nodes);
  }
  return exportAsciiSTL(nodes);
}

function exportAsciiSTL(nodes: CADNode[]): Blob {
  let output = 'solid amonite_cad_model\n';

  nodes.forEach((node) => {
    if (!node.visible) return;
    const geom = createGeometryForNode(node);
    const pos = geom.getAttribute('position');
    const index = geom.getIndex();

    // Apply node transform
    const matrix = new THREE.Matrix4();
    const rot = new THREE.Euler(
      (node.rotation.x * Math.PI) / 180,
      (node.rotation.y * Math.PI) / 180,
      (node.rotation.z * Math.PI) / 180
    );
    const position = new THREE.Vector3(node.position.x, node.position.y, node.position.z);
    const scale = new THREE.Vector3(node.scale.x, node.scale.y, node.scale.z);
    matrix.compose(position, new THREE.Quaternion().setFromEuler(rot), scale);

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const normal = new THREE.Vector3();

    const processFacet = (a: number, b: number, c: number) => {
      vA.fromBufferAttribute(pos, a).applyMatrix4(matrix);
      vB.fromBufferAttribute(pos, b).applyMatrix4(matrix);
      vC.fromBufferAttribute(pos, c).applyMatrix4(matrix);

      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab).normalize();
      normal.copy(cb);

      output += `  facet normal ${normal.x.toFixed(6)} ${normal.y.toFixed(6)} ${normal.z.toFixed(6)}\n`;
      output += '    outer loop\n';
      output += `      vertex ${vA.x.toFixed(6)} ${vA.y.toFixed(6)} ${vA.z.toFixed(6)}\n`;
      output += `      vertex ${vB.x.toFixed(6)} ${vB.y.toFixed(6)} ${vB.z.toFixed(6)}\n`;
      output += `      vertex ${vC.x.toFixed(6)} ${vC.y.toFixed(6)} ${vC.z.toFixed(6)}\n`;
      output += '    endloop\n';
      output += '  endfacet\n';
    };

    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        processFacet(index.getX(i), index.getX(i + 1), index.getX(i + 2));
      }
    } else {
      for (let i = 0; i < pos.count; i += 3) {
        processFacet(i, i + 1, i + 2);
      }
    }
  });

  output += 'endsolid amonite_cad_model\n';
  return new Blob([output], { type: 'text/plain;charset=utf-8' });
}

function exportBinarySTL(nodes: CADNode[]): Blob {
  let trianglesCount = 0;
  const geometries: { geom: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] = [];

  nodes.forEach((node) => {
    if (!node.visible) return;
    const geom = createGeometryForNode(node);
    const matrix = new THREE.Matrix4();
    const rot = new THREE.Euler(
      (node.rotation.x * Math.PI) / 180,
      (node.rotation.y * Math.PI) / 180,
      (node.rotation.z * Math.PI) / 180
    );
    matrix.compose(
      new THREE.Vector3(node.position.x, node.position.y, node.position.z),
      new THREE.Quaternion().setFromEuler(rot),
      new THREE.Vector3(node.scale.x, node.scale.y, node.scale.z)
    );

    const index = geom.getIndex();
    const pos = geom.getAttribute('position');
    const triangles = index ? index.count / 3 : pos.count / 3;
    trianglesCount += triangles;
    geometries.push({ geom, matrix });
  });

  const bufferSize = 84 + trianglesCount * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const data = new DataView(buffer);

  // 80 bytes header
  const title = 'Amonite CAD Binary STL Export';
  for (let i = 0; i < title.length; i++) {
    data.setUint8(i, title.charCodeAt(i));
  }

  // 4 bytes triangle count
  data.setUint32(80, trianglesCount, true);

  let offset = 84;
  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vC = new THREE.Vector3();
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();

  geometries.forEach(({ geom, matrix }) => {
    const pos = geom.getAttribute('position');
    const index = geom.getIndex();

    const writeTriangle = (a: number, b: number, c: number) => {
      vA.fromBufferAttribute(pos, a).applyMatrix4(matrix);
      vB.fromBufferAttribute(pos, b).applyMatrix4(matrix);
      vC.fromBufferAttribute(pos, c).applyMatrix4(matrix);

      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab).normalize();

      // Normal
      data.setFloat32(offset, cb.x, true);
      data.setFloat32(offset + 4, cb.y, true);
      data.setFloat32(offset + 8, cb.z, true);
      offset += 12;

      // Vertices
      data.setFloat32(offset, vA.x, true);
      data.setFloat32(offset + 4, vA.y, true);
      data.setFloat32(offset + 8, vA.z, true);
      offset += 12;

      data.setFloat32(offset, vB.x, true);
      data.setFloat32(offset + 4, vB.y, true);
      data.setFloat32(offset + 8, vB.z, true);
      offset += 12;

      data.setFloat32(offset, vC.x, true);
      data.setFloat32(offset + 4, vC.y, true);
      data.setFloat32(offset + 8, vC.z, true);
      offset += 12;

      // Attribute byte count
      data.setUint16(offset, 0, true);
      offset += 2;
    };

    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        writeTriangle(index.getX(i), index.getX(i + 1), index.getX(i + 2));
      }
    } else {
      for (let i = 0; i < pos.count; i += 3) {
        writeTriangle(i, i + 1, i + 2);
      }
    }
  });

  return new Blob([buffer], { type: 'application/octet-stream' });
}
