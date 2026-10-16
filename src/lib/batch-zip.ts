import * as THREE from 'three';
import { exportToSTL } from './parsers/stl-exporter';
import { CADNode, VesselParams } from './cad-types';
import { createVesselGeometry, VESSEL_FINISHES } from './vessel-geometry';

// CRC32 Table for standard zip generation
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

export function computeCRC32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileInput {
  name: string;
  data: Uint8Array | string;
}

/**
 * Creates an uncompressed standard ZIP archive (PK 03 04, Store method 0) in pure TypeScript.
 * 100% client-side compatible with Windows Explorer, macOS Archive Utility, Cura, Bambu Studio, and 7-Zip.
 */
export function createZipArchive(files: ZipFileInput[]): Blob {
  const encoder = new TextEncoder();
  const fileRecords: Array<{
    nameBytes: Uint8Array;
    dataBytes: Uint8Array;
    crc: number;
    offset: number;
  }> = [];

  const localChunks: Uint8Array[] = [];
  let currentOffset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate =
    (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const dataBytes = typeof f.data === 'string' ? encoder.encode(f.data) : f.data;
    const crc = computeCRC32(dataBytes);

    const record = {
      nameBytes,
      dataBytes,
      crc,
      offset: currentOffset,
    };
    fileRecords.push(record);

    // Local file header (30 bytes + name + data)
    const header = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(header.buffer);
    dv.setUint32(0, 0x04034b50, true); // Local file header signature
    dv.setUint16(4, 20, true); // Version needed to extract (2.0)
    dv.setUint16(6, 0, true); // General purpose bit flag
    dv.setUint16(8, 0, true); // Compression method (0 = stored)
    dv.setUint16(10, dosTime, true);
    dv.setUint16(12, dosDate, true);
    dv.setUint32(14, crc, true); // CRC32
    dv.setUint32(18, dataBytes.length, true); // Compressed size
    dv.setUint32(22, dataBytes.length, true); // Uncompressed size
    dv.setUint16(26, nameBytes.length, true); // Filename length
    dv.setUint16(28, 0, true); // Extra field length
    header.set(nameBytes, 30);

    localChunks.push(header);
    localChunks.push(dataBytes);
    currentOffset += header.length + dataBytes.length;
  }

  const centralDirOffset = currentOffset;
  const centralChunks: Uint8Array[] = [];
  let centralDirSize = 0;

  for (const r of fileRecords) {
    // Central directory file header (46 bytes + name)
    const cdh = new Uint8Array(46 + r.nameBytes.length);
    const dv = new DataView(cdh.buffer);
    dv.setUint32(0, 0x02014b50, true); // Central directory header signature
    dv.setUint16(4, 20, true); // Version made by
    dv.setUint16(6, 20, true); // Version needed to extract
    dv.setUint16(8, 0, true); // Bit flag
    dv.setUint16(10, 0, true); // Compression method
    dv.setUint16(12, dosTime, true);
    dv.setUint16(14, dosDate, true);
    dv.setUint32(16, r.crc, true);
    dv.setUint32(20, r.dataBytes.length, true);
    dv.setUint32(24, r.dataBytes.length, true);
    dv.setUint16(28, r.nameBytes.length, true);
    dv.setUint16(30, 0, true); // Extra field length
    dv.setUint16(32, 0, true); // File comment length
    dv.setUint16(34, 0, true); // Disk number start
    dv.setUint16(36, 0, true); // Internal file attributes
    dv.setUint32(38, 0, true); // External file attributes
    dv.setUint32(42, r.offset, true); // Relative offset of local header
    cdh.set(r.nameBytes, 46);

    centralChunks.push(cdh);
    centralDirSize += cdh.length;
  }

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdDv = new DataView(eocd.buffer);
  eocdDv.setUint32(0, 0x06054b50, true); // EOCD signature
  eocdDv.setUint16(4, 0, true); // Number of this disk
  eocdDv.setUint16(6, 0, true); // Disk with central directory
  eocdDv.setUint16(8, fileRecords.length, true); // Total entries on this disk
  eocdDv.setUint16(10, fileRecords.length, true); // Total entries
  eocdDv.setUint32(12, centralDirSize, true); // Size of central directory
  eocdDv.setUint32(16, centralDirOffset, true); // Offset of central directory
  eocdDv.setUint16(20, 0, true); // ZIP comment length

  const allChunks = [...localChunks, ...centralChunks, eocd];
  const totalLength = allChunks.reduce((acc, c) => acc + c.length, 0);
  const out = new Uint8Array(totalLength);
  let pos = 0;
  for (const c of allChunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return new Blob([out.buffer as ArrayBuffer], { type: 'application/zip' });
}

export interface EtsyVariation {
  id: string;
  title: string;
  filename: string;
  params: VesselParams;
}

/**
 * Creates 6 commercial product variations from a user's active vessel parameters.
 */
export function buildEtsyVariations(base: VesselParams): EtsyVariation[] {
  return [
    {
      id: '01-tall-classic',
      title: 'Tall Classic Vessel',
      filename: `01-Tall-Classic-${base.archetype}.stl`,
      params: {
        ...base,
        height: Math.min(230, Math.round(base.height * 1.25)),
        baseRadius: Math.max(30, Math.round(base.baseRadius * 0.9)),
        ribCount: base.ribCount || 24,
      },
    },
    {
      id: '02-petite-catchall',
      title: 'Petite Desk Catchall',
      filename: `02-Petite-Desk-${base.archetype}.stl`,
      params: {
        ...base,
        height: Math.max(65, Math.round(base.height * 0.62)),
        baseRadius: Math.min(85, Math.round(base.baseRadius * 1.15)),
        wallThickness: Math.min(8, base.wallThickness + 1),
      },
    },
    {
      id: '03-wide-statement',
      title: 'Wide Statement Centerpiece',
      filename: `03-Wide-Statement-${base.archetype}.stl`,
      params: {
        ...base,
        height: Math.round(base.height * 0.88),
        baseRadius: Math.min(90, Math.round(base.baseRadius * 1.35)),
        ribCount: Math.max(16, base.ribCount),
      },
    },
    {
      id: '04-architectural-fluted',
      title: 'Architectural Fluted Edition',
      filename: `04-Architectural-Fluted-${base.archetype}.stl`,
      params: {
        ...base,
        ribCount: Math.max(24, (base.ribCount || 16) + 8),
        waveAmplitude: Math.min(10, base.waveAmplitude + 1.5),
      },
    },
    {
      id: '05-helical-twist',
      title: 'Helical Biophilic Twist',
      filename: `05-Helical-Twist-${base.archetype}.stl`,
      params: {
        ...base,
        twistAngle: ((base.twistAngle || 0) + 90) % 180 || 90,
        waveAmplitude: Math.max(2, base.waveAmplitude),
        wallThickness: Math.max(3, base.wallThickness - 0.5),
      },
    },
    {
      id: '06-kiln-compensated',
      title: 'Kiln-Compensated Ceramic Solid',
      filename: `06-Kiln-Compensated-Fired-${base.archetype}.stl`,
      params: {
        ...base,
        shrinkagePercent: base.shrinkagePercent && base.shrinkagePercent > 0 ? base.shrinkagePercent : 11.8,
      },
    },
  ];
}

/**
 * Generates listing guide documentation for Etsy creators.
 */
export function generateEtsyListingGuide(base: VesselParams): string {
  const shrinkage = base.shrinkagePercent && base.shrinkagePercent > 0 ? base.shrinkagePercent : 11.8;
  const printH = (base.height * (1 + shrinkage / 100)).toFixed(1);

  return `================================================================================
AMONITE ATELIER — ETSY / BOUTIQUE COLLECTION EXPORT PACK
Model Archetype: ${base.archetype.toUpperCase()}
Generated on: ${new Date().toISOString()}
================================================================================

1. WHAT IS IN THIS DROP
--------------------------------------------------------------------------------
This archive contains 6 production-ready, watertight STLs designed specifically
for minimal interior decor shops, boutique ceramics, and Etsy 3D printing stores.

  * 01-Tall-Classic-${base.archetype}.stl       - Elegant tall vase for dried florals
  * 02-Petite-Desk-${base.archetype}.stl        - Compact desk vessel / candle catchall
  * 03-Wide-Statement-${base.archetype}.stl     - Low center-table focal vessel
  * 04-Architectural-Fluted-${base.archetype}.stl - Dense architectural fluting
  * 05-Helical-Twist-${base.archetype}.stl       - Organic helical light-diffusing form
  * 06-Kiln-Compensated-Fired-${base.archetype}.stl - Pre-scaled +${shrinkage}% for clay shrinkage

2. RECOMMENDED 3D PRINTING SETTINGS (Bambu Studio / PrusaSlicer / Cura)
--------------------------------------------------------------------------------
* Mode: Single-wall Spiralize Outer Contour ("Vase Mode") OR Normal Shell
* Nozzle Diameter: 0.6 mm or 0.8 mm (recommended for tactile ceramic feel)
* Layer Height: 0.32 mm - 0.45 mm
* Bottom Solid Layers: 4 to 6 layers (watertight base)
* Infill: 0% (Hollow watertight shell)
* Filament: Matte Terracotta PLA, Sandstone PLA, Recycled PETG, or Direct Ceramic Clay

3. CERAMIC KILN SHRINKAGE SPECIFICATIONS
--------------------------------------------------------------------------------
Clay shrinks significantly during drying and bisque/glaze firing.
File 06 has been scaled by +${shrinkage}% compensation so your final fired piece
matches your intended target height of ${base.height}mm:
  - Nominal Fired Target: ${base.height} mm
  - Pre-Fired Greenware Print Size: ${printH} mm (+${shrinkage}%)

Common Reference Shrinkage Rates:
  - Terracotta Earthenware: +9.5%
  - Buff Stoneware / Speckled Clay: +11.8%
  - High-fire Porcelain: +14.2%

4. COPY-PASTE ETSY LISTING METADATA
--------------------------------------------------------------------------------
[Suggested Listing Title]:
Modern Fluted Minimalist Vessel Collection | 3D Printed Ceramic Vase Decor | Digital STL Pack

[Suggested Etsy Tags] (13 tags max):
minimalist vase, ceramic 3d print, japandi home, modern decor, brutalist vessel,
fluted planter, dried flower vase, 3d print stl, aesthetic catchall, pottery toolpath,
sculptural vase, clay printing, interior design

[Suggested Retail Pricing]:
* Digital STL 6-Pack: $16.00 - $24.00 USD
* Finished Printed Vessel (Physical, 170mm): $44.00 - $68.00 USD
* Finished Stoneware Ceramic (Fired & Glazed): $78.00 - $125.00 USD

================================================================================
Generated with Amonite — The 3D Studio for Minimalist Interior Decor
https://amonite.design
================================================================================`;
}

/**
 * Converts a VesselParams object into a synthetic CADNode for STL export.
 */
function vesselParamsToNode(p: VesselParams): CADNode {
  return {
    id: `batch-${p.archetype}-${Date.now()}`,
    name: p.archetype,
    type: 'vessel',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    dimensions: {},
    color: '#d9c7a8',
    visible: true,
    wireframe: false,
    vessel: p,
  };
}

/**
 * Generates an offscreen render of a vessel on a studio pedestal as a PNG Uint8Array.
 * Returns null if WebGL is unavailable or running in a headless test environment.
 */
export async function renderVesselMockupPNG(
  params: VesselParams,
  width = 600,
  height = 600
): Promise<Uint8Array | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161310);

    // Warm gallery studio lighting
    const hemi = new THREE.HemisphereLight(0xfff8f0, 0x221a14, 0.9);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff4ea, 1.9);
    key.position.set(130, 240, 160);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffdfb8, 1.5);
    rim.position.set(20, 180, -180);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0xb0c8dc, 0.65);
    fill.position.set(-150, 100, 100);
    scene.add(fill);

    // Plinth pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(80, 84, 8, 64),
      new THREE.MeshStandardMaterial({ color: 0x1f1b17, roughness: 0.88, metalness: 0.05 })
    );
    pedestal.position.y = -4;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Vessel geometry
    const geom = createVesselGeometry(params);
    const finish = VESSEL_FINISHES[params.finish] ?? VESSEL_FINISHES.sandstone;
    const mat = new THREE.MeshStandardMaterial({
      color: finish.color,
      roughness: finish.roughness,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const vesselMesh = new THREE.Mesh(geom, mat);
    vesselMesh.castShadow = true;
    vesselMesh.receiveShadow = false;
    scene.add(vesselMesh);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 2000);
    const h = params.height;
    const targetY = h * 0.48;
    const dist = Math.max(220, h * 1.75);
    camera.position.set(dist * 0.65, targetY + dist * 0.38, dist * 0.72);
    camera.lookAt(0, targetY, 0);

    renderer.render(scene, camera);

    // Extract PNG data as ArrayBuffer
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Cleanup WebGL resources
    geom.dispose();
    mat.dispose();
    pedestal.geometry.dispose();
    (pedestal.material as THREE.Material).dispose();
    renderer.dispose();

    return bytes;
  } catch {
    return null;
  }
}

/**
 * Generates the full Etsy Batch Drop ZIP Archive containing 6 variations, mockups, and guides.
 */
export async function generateEtsyBatchDrop(base: VesselParams): Promise<Blob> {
  const variations = buildEtsyVariations(base);
  const files: ZipFileInput[] = [];

  // 1. Generate 6 Binary STLs
  for (const v of variations) {
    const node = vesselParamsToNode(v.params);
    const stlBlob = exportToSTL([node], true);
    const stlBuffer = await stlBlob.arrayBuffer();
    files.push({
      name: `models/${v.filename}`,
      data: new Uint8Array(stlBuffer),
    });
  }

  // 2. Generate listing guide
  const guide = generateEtsyListingGuide(base);
  files.push({
    name: 'README_ETSY_PRODUCTION_GUIDE.txt',
    data: guide,
  });

  // 3. Generate Listing Mockup PNG renders (for first 3 variations)
  for (let i = 0; i < Math.min(3, variations.length); i++) {
    const v = variations[i];
    const pngBytes = await renderVesselMockupPNG(v.params);
    if (pngBytes) {
      files.push({
        name: `mockups/etsy-listing-mockup-0${i + 1}-${v.id}.png`,
        data: pngBytes,
      });
    }
  }

  // 4. Pack into standard ZIP
  return createZipArchive(files);
}
