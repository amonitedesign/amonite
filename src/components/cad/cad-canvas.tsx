'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useCADStore } from '@/store/cad-store';
import { createGeometryForNode } from '@/lib/geometry-engine';
import { VESSEL_FINISHES } from '@/lib/vessel-geometry';

type CADTaggedObject = THREE.Object3D & { cadNodeId?: string; lastDimKey?: string };

// Warm atelier stage constants.
const STAGE_BG = 0x161310;
const PEDESTAL_COLOR = 0x2a231b;
const EDGE_COLOR = 0x8a7f6a;

function vesselFrame(nodes: { type: string; vessel?: { height: number } }[]): { targetY: number; dist: number } {
  const vessel = nodes.find((n) => n.type === 'vessel' && n.vessel);
  const h = vessel?.vessel?.height ?? 170;
  return { targetY: h * 0.45, dist: Math.max(230, h * 1.6) };
}

export default function CADCanvas({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zustand Store selectors
  const nodes = useCADStore((s) => s.nodes);
  const viewport = useCADStore((s) => s.viewport);
  const cameraPresetTrigger = useCADStore((s) => s.cameraPresetTrigger);
  const activePreset = useCADStore((s) => s.activePreset);

  // References to keep Three.js instances stable across React renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const perspCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const meshesMapRef = useRef<Map<string, THREE.Group>>(new Map());

  // 1. Initialize Scene, Renderer, Cameras, and the atelier stage
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;
    const aspect = width / height;

    // Scene — warm charcoal with a breath of depth fog.
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(STAGE_BG);
    scene.fog = new THREE.Fog(STAGE_BG, 500, 1100);
    sceneRef.current = scene;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    // Cameras
    const perspCamera = new THREE.PerspectiveCamera(40, aspect, 0.1, 3000);
    perspCamera.position.set(170, 150, 210);
    perspCameraRef.current = perspCamera;

    const frustumSize = 320;
    const orthoCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      3000
    );
    orthoCamera.position.set(170, 150, 210);
    orthoCameraRef.current = orthoCamera;

    activeCameraRef.current = perspCamera;

    // OrbitControls — the only interaction: orbit, pan, zoom.
    const orbit = new OrbitControls(perspCamera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.06;
    orbit.target.set(0, 75, 0);
    orbit.minDistance = 80;
    orbit.maxDistance = 900;
    orbit.maxPolarAngle = Math.PI * 0.55;
    orbit.update();
    orbitControlsRef.current = orbit;

    // Lighting — soft gallery warmth.
    const hemi = new THREE.HemisphereLight(0xfff4e6, 0x2a2118, 0.55);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffe9d2, 1.6);
    key.position.set(120, 220, 140);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.left = -200;
    key.shadow.camera.right = 200;
    key.shadow.camera.top = 260;
    key.shadow.camera.bottom = -60;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xd8dee9, 0.3);
    fill.position.set(-140, 80, -120);
    scene.add(fill);

    // Pedestal — a quiet plinth the vessel rests on.
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(110, 116, 10, 72),
      new THREE.MeshStandardMaterial({ color: PEDESTAL_COLOR, roughness: 0.9, metalness: 0 })
    );
    pedestal.position.y = -5;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Ground shadow catcher.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1600, 1600),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -10;
    ground.receiveShadow = true;
    scene.add(ground);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const asp = w / h;

      if (perspCameraRef.current) {
        perspCameraRef.current.aspect = asp;
        perspCameraRef.current.updateProjectionMatrix();
      }

      if (orthoCameraRef.current) {
        orthoCameraRef.current.left = (frustumSize * asp) / -2;
        orthoCameraRef.current.right = (frustumSize * asp) / 2;
        orthoCameraRef.current.top = frustumSize / 2;
        orthoCameraRef.current.bottom = frustumSize / -2;
        orthoCameraRef.current.updateProjectionMatrix();
      }

      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (orbitControlsRef.current) {
        orbitControlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && activeCameraRef.current) {
        rendererRef.current.render(sceneRef.current, activeCameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // 2. Handle Camera Mode Switches (Perspective vs Orthographic)
  useEffect(() => {
    if (!perspCameraRef.current || !orthoCameraRef.current || !orbitControlsRef.current) return;

    const target = orbitControlsRef.current.target.clone();

    if (viewport.cameraMode === 'orthographic') {
      orthoCameraRef.current.position.copy(perspCameraRef.current.position);
      orthoCameraRef.current.quaternion.copy(perspCameraRef.current.quaternion);
      activeCameraRef.current = orthoCameraRef.current;
      orbitControlsRef.current.object = orthoCameraRef.current;
    } else {
      perspCameraRef.current.position.copy(orthoCameraRef.current.position);
      perspCameraRef.current.quaternion.copy(orthoCameraRef.current.quaternion);
      activeCameraRef.current = perspCameraRef.current;
      orbitControlsRef.current.object = perspCameraRef.current;
    }

    orbitControlsRef.current.target.copy(target);
    orbitControlsRef.current.update();
  }, [viewport.cameraMode]);

  // 3. Handle Camera Orientation Presets — framed on the vessel.
  useEffect(() => {
    if (!orbitControlsRef.current || !activeCameraRef.current) return;
    const { targetY, dist } = vesselFrame(nodes);
    const target = new THREE.Vector3(0, targetY, 0);
    orbitControlsRef.current.target.copy(target);

    switch (activePreset) {
      case 'iso':
        activeCameraRef.current.position.set(dist * 0.62, targetY + dist * 0.45, dist * 0.72);
        break;
      case 'top':
        activeCameraRef.current.position.set(0, targetY + dist, 0.001);
        break;
      case 'front':
        activeCameraRef.current.position.set(0, targetY, dist);
        break;
      case 'right':
        activeCameraRef.current.position.set(dist, targetY, 0);
        break;
      case 'bottom':
        activeCameraRef.current.position.set(0, targetY - dist, 0.001);
        break;
      case 'back':
        activeCameraRef.current.position.set(0, targetY, -dist);
        break;
      case 'left':
        activeCameraRef.current.position.set(-dist, targetY, 0);
        break;
    }
    orbitControlsRef.current.update();
  }, [cameraPresetTrigger, activePreset, nodes]);

  // 4. Synchronize 3D Meshes from Zustand nodes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentMeshes = meshesMapRef.current;
    const activeNodeIds = new Set(nodes.map((n) => n.id));

    // Remove old meshes that no longer exist
    currentMeshes.forEach((group, id) => {
      if (!activeNodeIds.has(id)) {
        scene.remove(group);
        currentMeshes.delete(id);
      }
    });

    // Create or update meshes
    nodes.forEach((node) => {
      let group = currentMeshes.get(node.id);

      if (!group) {
        group = new THREE.Group();
        group.name = node.id;
        (group as CADTaggedObject).cadNodeId = node.id;

        const geom = createGeometryForNode(node);
        const isVessel = node.type === 'vessel' && node.vessel;
        const finish = isVessel && node.vessel ? VESSEL_FINISHES[node.vessel.finish] : null;
        const mat = new THREE.MeshStandardMaterial({
          color: finish ? finish.color : node.color,
          roughness: finish ? finish.roughness : 0.6,
          metalness: 0,
          wireframe: !isVessel && (viewport.renderStyle === 'wireframe' || node.wireframe),
          side: isVessel ? THREE.DoubleSide : THREE.FrontSide,
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        (mesh as CADTaggedObject).cadNodeId = node.id;
        (mesh as CADTaggedObject).lastDimKey =
          JSON.stringify(node.vessel ?? node.dimensions) + '-' + node.type;
        group.add(mesh);

        if (!isVessel) {
          // Soft edge lines for imported vector geometry.
          const edgesGeom = new THREE.EdgesGeometry(geom, 25);
          const edgesMat = new THREE.LineBasicMaterial({
            color: EDGE_COLOR,
            transparent: true,
            opacity: 0.5,
          });
          const edgesLine = new THREE.LineSegments(edgesGeom, edgesMat);
          edgesLine.name = 'edges';
          group.add(edgesLine);
        }

        scene.add(group);
        currentMeshes.set(node.id, group);
      } else {
        // Update existing mesh
        const mesh = group.children[0] as THREE.Mesh;
        if (mesh) {
          const dimKey = JSON.stringify(node.vessel ?? node.dimensions) + '-' + node.type;
          if ((mesh as CADTaggedObject).lastDimKey !== dimKey) {
            // Dispose old geometry and regenerate
            mesh.geometry.dispose();
            const newGeom = createGeometryForNode(node);
            mesh.geometry = newGeom;
            mesh.geometry.computeBoundingBox();
            mesh.geometry.computeBoundingSphere();

            // Rebuild edges for non-vessel nodes
            const edgesLine = group.getObjectByName('edges') as THREE.LineSegments | null;
            if (edgesLine && node.type !== 'vessel') {
              edgesLine.geometry.dispose();
              edgesLine.geometry = new THREE.EdgesGeometry(newGeom, 25);
            }

            (mesh as CADTaggedObject).lastDimKey = dimKey;
          }

          const mat = mesh.material as THREE.MeshStandardMaterial;
          const isVessel = node.type === 'vessel' && node.vessel;
          const finish = isVessel && node.vessel ? VESSEL_FINISHES[node.vessel.finish] : null;
          if (finish) {
            mat.color.set(finish.color);
            mat.roughness = finish.roughness;
            mat.side = THREE.DoubleSide;
          } else {
            mat.color.set(node.color);
            mat.wireframe = viewport.renderStyle === 'wireframe' || node.wireframe;
            mat.side = THREE.FrontSide;
          }
          mat.needsUpdate = true;
        }
      }

      // Sync transform
      group.position.set(node.position.x, node.position.y, node.position.z);
      group.rotation.set(
        (node.rotation.x * Math.PI) / 180,
        (node.rotation.y * Math.PI) / 180,
        (node.rotation.z * Math.PI) / 180
      );
      group.scale.set(node.scale.x, node.scale.y, node.scale.z);
      group.visible = node.visible;
    });
  }, [nodes, viewport.renderStyle]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className ?? ''}`}
      style={{ background: '#161310' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block outline-none"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
}
