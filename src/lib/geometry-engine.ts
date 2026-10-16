import * as THREE from 'three';
import { CADNode } from './cad-types';

/**
 * Creates a Three.js BufferGeometry based on the CADNode parametric properties.
 */
export function createGeometryForNode(node: CADNode): THREE.BufferGeometry {
  const d = node.dimensions;

  switch (node.type) {
    case 'box':
      return new THREE.BoxGeometry(
        d.width || 40,
        d.height || 40,
        d.depth || 40
      );

    case 'cylinder':
      return new THREE.CylinderGeometry(
        d.radius || 20,
        d.radius || 20,
        d.height || 40,
        d.radialSegments || 32
      );

    case 'sphere':
      return new THREE.SphereGeometry(
        d.radius || 25,
        d.radialSegments || 32,
        Math.floor((d.radialSegments || 32) / 2)
      );

    case 'torus':
      return new THREE.TorusGeometry(
        d.radius || 25,
        d.tube || 8,
        d.radialSegments || 24,
        d.tubularSegments || 48
      );

    case 'cone':
      return new THREE.ConeGeometry(
        d.radius || 20,
        d.height || 40,
        d.radialSegments || 32
      );

    case 'extrusion': {
      const shape = new THREE.Shape();
      const points = node.extrusionPoints || [
        { x: -20, y: -20 },
        { x: 20, y: -20 },
        { x: 20, y: 20 },
        { x: 0, y: 35 },
        { x: -20, y: 20 },
      ];

      shape.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].y);
      }
      shape.closePath();

      return new THREE.ExtrudeGeometry(shape, {
        depth: d.height || 20,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 1,
        bevelThickness: 1,
      });
    }

    default:
      return new THREE.BoxGeometry(20, 20, 20);
  }
}

/**
 * Generates an ammonite logarithmic spiral curve as a 3D spline representation.
 */
export function createAmmoniteSpiralGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const turns = 4;
  const totalPoints = 300;
  const a = 1.2;
  const b = 0.18;

  for (let i = 0; i <= totalPoints; i++) {
    const theta = (i / totalPoints) * turns * Math.PI * 2;
    const r = a * Math.exp(b * theta);
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    const y = Math.sin(theta * 2) * 2;
    points.push(new THREE.Vector3(x, y, z));
  }

  return new THREE.BufferGeometry().setFromPoints(points);
}
