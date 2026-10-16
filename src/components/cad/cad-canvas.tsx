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
const PEDESTAL_COLOR = 0x1f1b17;
const EDGE_COLOR = 0x8a7f6a;

function vesselFrame(nodes: { type: string; vessel?: { height: number } }[]): { targetY: number; dist: number } {
  const vessel = nodes.find((n) => n.type === 'vessel' && n.vessel);
  const h = vessel?.vessel?.height ?? 170;
  // Generous headroom: side panels cover ~560px of frame width and the
  // pedestal sits below the vessel, so frame loose rather than tight.
  return { targetY: h * 0.46, dist: Math.max(260, h * 2.0) };
}

function applyCameraPreset(
  cam: THREE.Camera,
  orbit: OrbitControls,
  preset: string,
  targetY: number,
  dist: number
): void {
  orbit.target.set(0, targetY, 0);

  switch (preset) {
    case 'iso':
      cam.position.set(dist * 0.62, targetY + dist * 0.45, dist * 0.72);
      break;
    case 'top':
      cam.position.set(0, targetY + dist, 0.001);
      break;
    case 'front':
      cam.position.set(0, targetY, dist);
      break;
    case 'right':
      cam.position.set(dist, targetY, 0);
      break;
    case 'bottom':
      cam.position.set(0, targetY - dist, 0.001);
      break;
    case 'back':
      cam.position.set(0, targetY, -dist);
      break;
    case 'left':
      cam.position.set(-dist, targetY, 0);
      break;
    default:
      cam.position.set(dist * 0.62, targetY + dist * 0.45, dist * 0.72);
      break;
  }
  orbit.update();
}

export default function CADCanvas({
  className = '',
  autoRotate = true,
}: {
  className?: string;
  autoRotate?: boolean;
}) {
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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Cameras — 34° portrait focal length for luxury architectural presentation
    const perspCamera = new THREE.PerspectiveCamera(34, aspect, 0.1, 3000);
    perspCamera.position.set(160, 140, 200);
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
    orthoCamera.position.set(160, 140, 200);
    orthoCameraRef.current = orthoCamera;

    activeCameraRef.current = perspCamera;

    // OrbitControls — smooth turntable damping and rotation
    const orbit = new OrbitControls(perspCamera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.06;
    orbit.minDistance = 80;
    orbit.maxDistance = 1200;
    orbit.maxPolarAngle = Math.PI * 0.52;
    orbit.autoRotate = autoRotate;
    orbit.autoRotateSpeed = 0.75;
    // Frame the vessel on first mount (the preset effect only refires on
    // preset/node changes, so without this the hard-coded camera overfills).
    // Read the store directly: the init effect runs once by design.
    const { targetY: initY, dist: initDist } = vesselFrame(
      useCADStore.getState().nodes
    );
    applyCameraPreset(perspCamera, orbit, 'iso', initY, initDist);
    orbitControlsRef.current = orbit;

    // Lighting — soft architectural gallery warmth (Key + Fill + Rim + Hemisphere)
    const hemi = new THREE.HemisphereLight(0xfffaf0, 0x221a14, 0.95);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff6eb, 1.9);
    key.position.set(130, 240, 160);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.left = -160;
    key.shadow.camera.right = 160;
    key.shadow.camera.top = 260;
    key.shadow.camera.bottom = -40;
    key.shadow.bias = -0.0001;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xb0cce6, 0.65);
    fill.position.set(-150, 100, 110);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffdfb4, 1.6);
    rim.position.set(20, 180, -180);
    scene.add(rim);

    // Pedestal — refined studio plinth
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(80, 84, 8, 64),
      new THREE.MeshStandardMaterial({ color: PEDESTAL_COLOR, roughness: 0.88, metalness: 0.05 })
    );
    pedestal.position.y = -4;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Ground shadow catcher.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1600, 1600),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -8;
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
    const meshesMap = meshesMapRef.current;
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      // Full teardown: StrictMode (and route changes) remount this effect
      // while refs persist. Stale groups stay parented to the dead scene,
      // so dispose everything and reset the registry — otherwise meshes
      // silently never appear in the new scene.
      meshesMap.forEach((group) => {
        group.traverse((o) => {
          const mesh = o as THREE.Mesh;
          mesh.geometry?.dispose();
          const material = mesh.material as
            | THREE.Material
            | THREE.Material[]
            | undefined;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material?.dispose();
        });
        scene.remove(group);
      });
      meshesMap.clear();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as
          | THREE.Material
          | THREE.Material[]
          | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Sync autoRotate prop changes
  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // 3. Handle Camera Orientation Presets — framed on the vessel.
  useEffect(() => {
    if (!orbitControlsRef.current || !activeCameraRef.current) return;
    const { targetY, dist } = vesselFrame(nodes);
    applyCameraPreset(
      activeCameraRef.current,
      orbitControlsRef.current,
      activePreset,
      targetY,
      dist
    );
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

      // Re-parent guard: after a remount the registry may hold groups
      // parented to a disposed scene (see init-effect teardown).
      if (group && group.parent !== scene) {
        scene.add(group);
      }

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
        // Crucial fix: Vessel lathe meshes must NOT receiveShadow to prevent self-shadowing extinction on double-sided geometry.
        mesh.receiveShadow = !isVessel;
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
          mesh.castShadow = true;
          mesh.receiveShadow = !isVessel;
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
