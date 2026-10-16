'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { useCADStore } from '@/store/cad-store';
import { createGeometryForNode, createAmmoniteSpiralGeometry } from '@/lib/geometry-engine';

type CADTaggedObject = THREE.Object3D & { cadNodeId?: string };

export default function CADCanvas({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zustand Store selectors
  const nodes = useCADStore((s) => s.nodes);
  const selectedId = useCADStore((s) => s.selectedId);
  const transformMode = useCADStore((s) => s.transformMode);
  const viewport = useCADStore((s) => s.viewport);
  const cameraPresetTrigger = useCADStore((s) => s.cameraPresetTrigger);
  const activePreset = useCADStore((s) => s.activePreset);

  const setSelectedId = useCADStore((s) => s.setSelectedId);
  const updateNodeTransform = useCADStore((s) => s.updateNodeTransform);
  const setCursorCoords = useCADStore((s) => s.setCursorCoords);
  const measurePoints = useCADStore((s) => s.measurePoints);

  // References to keep Three.js instances stable across React renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const perspCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const meshesMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const measureLineRef = useRef<THREE.Line | null>(null);

  // 1. Initialize Scene, Renderer, and Cameras
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;
    const aspect = width / height;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e12); // Sleek deep technical dark tone
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
    rendererRef.current = renderer;

    // Cameras
    const perspCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000);
    perspCamera.position.set(120, 100, 140);
    perspCameraRef.current = perspCamera;

    const frustumSize = 250;
    const orthoCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      2000
    );
    orthoCamera.position.set(120, 100, 140);
    orthoCameraRef.current = orthoCamera;

    activeCameraRef.current = perspCamera;

    // OrbitControls
    const orbit = new OrbitControls(perspCamera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.05;
    orbit.target.set(0, 15, 0);
    orbit.update();
    orbitControlsRef.current = orbit;

    // TransformControls
    const transform = new TransformControls(perspCamera, renderer.domElement);
    transform.size = 0.75;
    scene.add(transform.getHelper());
    transformControlsRef.current = transform;

    // Disable OrbitControls while dragging transform gizmo
    transform.addEventListener('dragging-changed', (event) => {
      orbit.enabled = !event.value;
    });

    // Lighting (Studio CAD Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(80, 120, 100);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-80, 40, -100);
    scene.add(dirLight2);

    // CAD Engineering Ground Grid (adaptive — rebuilt on snap/size change)
    const gridHelper = new THREE.GridHelper(240, 48, 0x00e5ff, 0x1f2937);
    gridHelper.position.y = 0;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Coordinates Axes Helper
    const axesHelper = new THREE.AxesHelper(30);
    axesHelper.position.set(0, 0.1, 0);
    scene.add(axesHelper);

    // Background Decorative Ammonite Spiral Spline
    const spiralGeom = createAmmoniteSpiralGeometry();
    const spiralMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.15,
      linewidth: 1,
    });
    const spiralLine = new THREE.Line(spiralGeom, spiralMat);
    spiralLine.rotation.x = Math.PI / 2;
    spiralLine.position.set(0, 0.05, 0);
    scene.add(spiralLine);

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

    // Mouse Move Raycasting for Coordinate HUD
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersect = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !activeCameraRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, activeCameraRef.current);
      if (raycaster.ray.intersectPlane(plane, planeIntersect)) {
        setCursorCoords({
          x: Math.round(planeIntersect.x * 10) / 10,
          y: Math.round(planeIntersect.y * 10) / 10,
          z: Math.round(planeIntersect.z * 10) / 10,
        });
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

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
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [setCursorCoords]);

  // 2. Handle Camera Mode Switches (Perspective vs Orthographic)
  useEffect(() => {
    if (!perspCameraRef.current || !orthoCameraRef.current || !orbitControlsRef.current) return;

    const target = orbitControlsRef.current.target.clone();

    if (viewport.cameraMode === 'orthographic') {
      orthoCameraRef.current.position.copy(perspCameraRef.current.position);
      orthoCameraRef.current.quaternion.copy(perspCameraRef.current.quaternion);
      activeCameraRef.current = orthoCameraRef.current;
      orbitControlsRef.current.object = orthoCameraRef.current;
      if (transformControlsRef.current) {
        transformControlsRef.current.camera = orthoCameraRef.current;
      }
    } else {
      perspCameraRef.current.position.copy(orthoCameraRef.current.position);
      perspCameraRef.current.quaternion.copy(orthoCameraRef.current.quaternion);
      activeCameraRef.current = perspCameraRef.current;
      orbitControlsRef.current.object = perspCameraRef.current;
      if (transformControlsRef.current) {
        transformControlsRef.current.camera = perspCameraRef.current;
      }
    }

    orbitControlsRef.current.target.copy(target);
    orbitControlsRef.current.update();
  }, [viewport.cameraMode]);

  // 3. Handle Camera Orientation Presets (Iso, Top, Front, Right)
  useEffect(() => {
    if (!orbitControlsRef.current || !activeCameraRef.current) return;
    const dist = 180;
    const target = new THREE.Vector3(0, 15, 0);
    orbitControlsRef.current.target.copy(target);

    switch (activePreset) {
      case 'iso':
        activeCameraRef.current.position.set(dist * 0.7, dist * 0.6, dist * 0.7);
        break;
      case 'top':
        activeCameraRef.current.position.set(0, dist, 0.001);
        break;
      case 'front':
        activeCameraRef.current.position.set(0, 15, dist);
        break;
      case 'right':
        activeCameraRef.current.position.set(dist, 15, 0);
        break;
      case 'bottom':
        activeCameraRef.current.position.set(0, -dist, 0.001);
        break;
      case 'back':
        activeCameraRef.current.position.set(0, 15, -dist);
        break;
      case 'left':
        activeCameraRef.current.position.set(-dist, 15, 0);
        break;
    }
    orbitControlsRef.current.update();
  }, [cameraPresetTrigger, activePreset]);

  // 4. Handle Grid Visibility and adaptive subdivision (gridSize / snapStep)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const old = gridHelperRef.current;
    if (old) {
      scene.remove(old);
      old.geometry.dispose();
      const oldMat = old.material as THREE.Material | THREE.Material[];
      if (Array.isArray(oldMat)) oldMat.forEach((m) => m.dispose());
      else oldMat.dispose();
    }
    const size = viewport.gridSize || 200;
    const step = viewport.snapStep > 0 ? viewport.snapStep : 5;
    const divisions = Math.min(100, Math.max(10, Math.round(size / step)));
    const grid = new THREE.GridHelper(size, divisions, 0x00e5ff, 0x1f2937);
    grid.position.y = 0;
    grid.visible = viewport.gridVisible;
    scene.add(grid);
    gridHelperRef.current = grid;
  }, [viewport.gridVisible, viewport.gridSize, viewport.snapStep]);

  // 4b. Measurement caliper line (session-only overlay)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (measureLineRef.current) {
      scene.remove(measureLineRef.current);
      measureLineRef.current.geometry.dispose();
      (measureLineRef.current.material as THREE.Material).dispose();
      measureLineRef.current = null;
    }
    if (!measurePoints) return;
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(measurePoints.a.x, measurePoints.a.y, measurePoints.a.z),
      new THREE.Vector3(measurePoints.b.x, measurePoints.b.y, measurePoints.b.z),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: 0xfacc15 });
    const line = new THREE.Line(geom, mat);
    scene.add(line);
    measureLineRef.current = line;
  }, [measurePoints]);

  // 5. Synchronize 3D Meshes from Zustand nodes
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
        const isHiddenLine = viewport.renderStyle === 'hidden-line';
        const mat = new THREE.MeshStandardMaterial({
          color: node.color,
          roughness: 0.35,
          metalness: 0.25,
          wireframe: viewport.renderStyle === 'wireframe' || node.wireframe,
          transparent: isHiddenLine,
          opacity: isHiddenLine ? 0 : 1,
        });

        const mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = !isHiddenLine;
        mesh.receiveShadow = !isHiddenLine;
        mesh.visible = !isHiddenLine;
        (mesh as CADTaggedObject).cadNodeId = node.id;
        group.add(mesh);

        // Technical sharp edge lines for industrial look
        const edgesGeom = new THREE.EdgesGeometry(geom, 25);
        const edgesMat = new THREE.LineBasicMaterial({
          color: 0x00e5ff,
          linewidth: 1.5,
          transparent: true,
          opacity: 0.8,
        });
        const edgesLine = new THREE.LineSegments(edgesGeom, edgesMat);
        edgesLine.name = 'edges';
        group.add(edgesLine);

        scene.add(group);
        currentMeshes.set(node.id, group);
      } else {
        // Update existing mesh
        const mesh = group.children[0] as THREE.Mesh;
        if (mesh) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          const isHiddenLine = viewport.renderStyle === 'hidden-line';
          mat.color.set(node.color);
          mat.wireframe = viewport.renderStyle === 'wireframe' || node.wireframe;
          mat.transparent = isHiddenLine;
          mat.opacity = isHiddenLine ? 0 : 1;
          mat.needsUpdate = true;
          mesh.castShadow = !isHiddenLine;
          mesh.receiveShadow = !isHiddenLine;
          mesh.visible = !isHiddenLine;
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

  // 6. Handle Selection and Transform Gizmo attachment
  useEffect(() => {
    const transform = transformControlsRef.current;
    if (!transform) return;

    if (!selectedId || transformMode === 'select') {
      transform.detach();
      return;
    }

    const group = meshesMapRef.current.get(selectedId);
    if (group) {
      transform.attach(group);
      transform.setMode(transformMode);

      if (viewport.snapToGrid) {
        transform.setTranslationSnap(viewport.snapStep);
        transform.setRotationSnap(THREE.MathUtils.degToRad(15));
        transform.setScaleSnap(0.1);
      } else {
        transform.setTranslationSnap(null);
        transform.setRotationSnap(null);
        transform.setScaleSnap(null);
      }
    } else {
      transform.detach();
    }
  }, [selectedId, transformMode, viewport.snapToGrid, viewport.snapStep]);

  // 7. Bind transform gizmo drag changes back to Zustand
  useEffect(() => {
    const transform = transformControlsRef.current;
    if (!transform) return;

    const handleObjectChange = () => {
      const obj = transform.object;
      if (!obj || !(obj as CADTaggedObject).cadNodeId) return;
      const id = (obj as CADTaggedObject).cadNodeId as string;

      updateNodeTransform(
        id,
        { x: obj.position.x, y: obj.position.y, z: obj.position.z },
        {
          x: Math.round((obj.rotation.x * 180) / Math.PI),
          y: Math.round((obj.rotation.y * 180) / Math.PI),
          z: Math.round((obj.rotation.z * 180) / Math.PI),
        },
        { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
      );
    };

    transform.addEventListener('objectChange', handleObjectChange);
    return () => {
      transform.removeEventListener('objectChange', handleObjectChange);
    };
  }, [updateNodeTransform]);

  // 8. Direct Click Selection via Raycasting
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!containerRef.current || !activeCameraRef.current || !sceneRef.current) return;
    if (transformMode !== 'select') return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, activeCameraRef.current);

    const meshList: THREE.Object3D[] = [];
    meshesMapRef.current.forEach((group) => {
      meshList.push(group.children[0]);
    });

    const intersects = raycaster.intersectObjects(meshList, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const nodeId = (hit as CADTaggedObject).cadNodeId;
      if (nodeId) {
        setSelectedId(nodeId);
        return;
      }
    }

    // Clicked empty space
    setSelectedId(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-[#0a0b0e] ${className}`}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair outline-none"
      />

      {/* Viewport Floating Watermark Badge */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-md border border-cyan-500/20 text-xs font-mono text-cyan-400">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        AMONITE // WEBGL HARDWARE ACCELERATED
      </div>

      {/* XYZ axis gizmo (orientation reference, mirrors camera presets) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 flex flex-col gap-1 rounded-md bg-black/40 backdrop-blur-md border border-[#232733] px-2.5 py-2 font-mono text-[10px] font-bold"
      >
        <span className="flex items-center gap-1.5 text-red-400">
          <span className="inline-block h-0.5 w-4 bg-red-400" />X
        </span>
        <span className="flex items-center gap-1.5 text-green-400">
          <span className="inline-block h-0.5 w-4 bg-green-400" />Y
        </span>
        <span className="flex items-center gap-1.5 text-blue-400">
          <span className="inline-block h-0.5 w-4 bg-blue-400" />Z
        </span>
      </div>
    </div>
  );
}
